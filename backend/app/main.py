from fastapi import Depends, FastAPI, HTTPException, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from starlette.middleware.sessions import SessionMiddleware

from .database import Base, engine, get_db, settings
from .models import Bed, Owner, Property, Room, Stay, Tenant
from .security import hash_password, verify_password
from .schemas import CheckoutRequest, LoginRequest, OwnerCreate, OwnerResponse, PropertyCreate, PropertyResponse, RoomCreate, RoomResponse, StayCreate, StayResponse, TenantCreate, TenantResponse


app = FastAPI(title=settings.app_name, version="0.1.0")
if settings.app_env == "production" and settings.session_secret == "local-development-secret-change-before-deploying":
    raise RuntimeError("Set SESSION_SECRET to a unique value before running in production.")
app.add_middleware(
    SessionMiddleware,
    secret_key=settings.session_secret,
    same_site="lax",
    https_only=settings.session_https_only,
    session_cookie="pgconnect_session",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["Content-Type", "Authorization"],
)
Base.metadata.create_all(bind=engine)


@app.get("/health", tags=["health"])
def health_check() -> dict[str, str]:
    """Report that the API process is ready to receive requests."""
    return {"status": "ok", "service": "pg-connect-api"}


def current_owner(request: Request, db: Session) -> Owner:
    owner_id = request.session.get("owner_id")
    if not isinstance(owner_id, int):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Sign in to continue.")
    owner = db.get(Owner, owner_id)
    if owner is None:
        request.session.clear()
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Sign in to continue.")
    return owner


@app.post("/api/auth/register", response_model=OwnerResponse, status_code=status.HTTP_201_CREATED, tags=["authentication"])
def register_owner(payload: OwnerCreate, request: Request, db: Session = Depends(get_db)) -> Owner:
    owner = Owner(
        full_name=payload.full_name.strip(),
        email=str(payload.email).lower(),
        password_hash=hash_password(payload.password),
    )
    db.add(owner)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="An account with this email already exists.") from exc
    db.refresh(owner)
    request.session["owner_id"] = owner.id
    return owner


@app.post("/api/auth/login", response_model=OwnerResponse, tags=["authentication"])
def login_owner(payload: LoginRequest, request: Request, db: Session = Depends(get_db)) -> Owner:
    owner = db.scalar(select(Owner).where(Owner.email == str(payload.email).lower()))
    if owner is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Email or password is incorrect.")
    if not verify_password(payload.password, owner.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Email or password is incorrect.")
    request.session["owner_id"] = owner.id
    return owner


@app.post("/api/auth/logout", status_code=status.HTTP_204_NO_CONTENT, tags=["authentication"])
def logout_owner(request: Request) -> Response:
    request.session.clear()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@app.get("/api/auth/me", response_model=OwnerResponse, tags=["authentication"])
def get_current_owner(request: Request, db: Session = Depends(get_db)) -> Owner:
    return current_owner(request, db)


@app.get("/api/properties", response_model=list[PropertyResponse], tags=["properties"])
def list_properties(request: Request, db: Session = Depends(get_db)) -> list[dict]:
    owner = current_owner(request, db)
    properties = list(db.scalars(select(Property).where(Property.owner_id == owner.id, Property.active.is_(True)).order_by(Property.created_at)))
    result = []
    for property_record in properties:
        room_ids = list(db.scalars(select(Room.id).where(Room.property_id == property_record.id, Room.active.is_(True))))
        bed_ids = list(db.scalars(select(Bed.id).where(Bed.room_id.in_(room_ids), Bed.active.is_(True)))) if room_ids else []
        occupied_count = len(list(db.scalars(select(Stay.id).where(Stay.status == "active", Stay.bed_id.in_(bed_ids))))) if bed_ids else 0
        result.append({"id": property_record.id, "name": property_record.name, "locality": property_record.locality, "city": property_record.city, "floor_count": property_record.floor_count, "active": property_record.active, "created_at": property_record.created_at, "room_count": len(room_ids), "bed_count": len(bed_ids), "occupied_beds": occupied_count})
    return result


@app.get("/api/dashboard", tags=["dashboard"])
def dashboard_summary(request: Request, db: Session = Depends(get_db)) -> dict[str, int]:
    owner = current_owner(request, db)
    property_ids = list(db.scalars(select(Property.id).where(Property.owner_id == owner.id, Property.active.is_(True))))
    room_ids = list(db.scalars(select(Room.id).where(Room.property_id.in_(property_ids), Room.active.is_(True)))) if property_ids else []
    bed_ids = list(db.scalars(select(Bed.id).where(Bed.room_id.in_(room_ids), Bed.active.is_(True)))) if room_ids else []
    occupied_count = len(list(db.scalars(select(Stay.id).where(Stay.status == "active", Stay.bed_id.in_(bed_ids))))) if bed_ids else 0
    tenant_count = len(list(db.scalars(select(Tenant.id).where(Tenant.owner_id == owner.id))))
    return {"property_count": len(property_ids), "room_count": len(room_ids), "bed_count": len(bed_ids), "occupied_beds": occupied_count, "tenant_count": tenant_count}


@app.post("/api/properties", response_model=PropertyResponse, status_code=status.HTTP_201_CREATED, tags=["properties"])
def create_property(payload: PropertyCreate, request: Request, db: Session = Depends(get_db)) -> Property:
    owner = current_owner(request, db)
    property_record = Property(owner_id=owner.id, name=payload.name.strip(), locality=payload.locality.strip(), city=payload.city.strip())
    db.add(property_record)
    db.commit()
    db.refresh(property_record)
    return property_record


@app.get("/api/properties/{property_id}/rooms", response_model=list[RoomResponse], tags=["rooms"])
def list_rooms(property_id: int, request: Request, db: Session = Depends(get_db)) -> list[dict]:
    owner = current_owner(request, db)
    property_record = db.scalar(select(Property).where(Property.id == property_id, Property.owner_id == owner.id, Property.active.is_(True)))
    if property_record is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Property not found.")
    rooms = list(db.scalars(select(Room).where(Room.property_id == property_record.id, Room.active.is_(True)).order_by(Room.room_number)))
    result = []
    for room in rooms:
        beds = []
        for bed in room.beds:
            occupied = db.scalar(select(Stay.id).where(Stay.bed_id == bed.id, Stay.status == "active")) is not None
            beds.append({"id": bed.id, "label": bed.label, "monthly_rent": float(bed.monthly_rent) if bed.monthly_rent is not None else None, "available": not occupied})
        result.append({"id": room.id, "room_number": room.room_number, "floor_number": room.floor_number, "room_type": room.room_type, "capacity": room.capacity, "beds": beds})
    return result


@app.post("/api/properties/{property_id}/rooms", response_model=RoomResponse, status_code=status.HTTP_201_CREATED, tags=["rooms"])
def create_room(property_id: int, payload: RoomCreate, request: Request, db: Session = Depends(get_db)) -> dict:
    owner = current_owner(request, db)
    property_record = db.scalar(select(Property).where(Property.id == property_id, Property.owner_id == owner.id, Property.active.is_(True)))
    if property_record is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Property not found.")
    labels = [label.strip() for label in payload.bed_labels]
    if len(labels) != len(set(label.casefold() for label in labels)) or any(not label for label in labels):
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Bed labels must be unique and non-empty.")
    room = Room(property_id=property_record.id, room_number=payload.room_number.strip(), floor_number=payload.floor_number, room_type=payload.room_type.strip(), capacity=len(labels))
    room.beds = [Bed(label=label) for label in labels]
    db.add(room)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="That room number already exists at this property.") from exc
    db.refresh(room)
    return {"id": room.id, "room_number": room.room_number, "floor_number": room.floor_number, "room_type": room.room_type, "capacity": room.capacity, "beds": [{"id": bed.id, "label": bed.label, "monthly_rent": None, "available": True} for bed in room.beds]}


@app.get("/api/tenants", response_model=list[TenantResponse], tags=["tenants"])
def list_tenants(request: Request, db: Session = Depends(get_db)) -> list[dict]:
    owner = current_owner(request, db)
    tenants = list(db.scalars(select(Tenant).where(Tenant.owner_id == owner.id).order_by(Tenant.full_name)))
    result = []
    for tenant in tenants:
        stay = db.scalar(select(Stay).where(Stay.tenant_id == tenant.id, Stay.status == "active"))
        current_stay = None
        if stay is not None:
            bed = db.get(Bed, stay.bed_id)
            room = db.get(Room, bed.room_id) if bed else None
            property_record = db.get(Property, room.property_id) if room else None
            if bed and room and property_record:
                current_stay = {"id": stay.id, "property_name": property_record.name, "room_number": room.room_number, "bed_label": bed.label, "check_in": stay.check_in, "agreed_monthly_rent": float(stay.agreed_monthly_rent)}
        result.append({"id": tenant.id, "full_name": tenant.full_name, "phone": tenant.phone, "email": tenant.email, "emergency_contact": tenant.emergency_contact, "created_at": tenant.created_at, "current_stay": current_stay})
    return result


@app.post("/api/tenants", response_model=TenantResponse, status_code=status.HTTP_201_CREATED, tags=["tenants"])
def create_tenant(payload: TenantCreate, request: Request, db: Session = Depends(get_db)) -> Tenant:
    owner = current_owner(request, db)
    tenant = Tenant(owner_id=owner.id, full_name=payload.full_name.strip(), phone=payload.phone.strip(), email=str(payload.email).lower() if payload.email else None, emergency_contact=payload.emergency_contact)
    db.add(tenant)
    db.commit()
    db.refresh(tenant)
    return tenant


@app.post("/api/stays", response_model=StayResponse, status_code=status.HTTP_201_CREATED, tags=["allocations"])
def allocate_bed(payload: StayCreate, request: Request, db: Session = Depends(get_db)) -> Stay:
    owner = current_owner(request, db)
    tenant = db.scalar(select(Tenant).where(Tenant.id == payload.tenant_id, Tenant.owner_id == owner.id))
    bed = db.scalar(select(Bed).join(Room).join(Property).where(Bed.id == payload.bed_id, Property.owner_id == owner.id, Bed.active.is_(True), Room.active.is_(True), Property.active.is_(True)).with_for_update())
    if tenant is None or bed is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tenant or bed not found.")
    occupied = db.scalar(select(Stay.id).where(Stay.bed_id == bed.id, Stay.status == "active"))
    if occupied is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="This bed is already occupied.")
    active_stay = db.scalar(select(Stay.id).where(Stay.tenant_id == tenant.id, Stay.status == "active"))
    if active_stay is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="This tenant already has an active stay.")
    stay = Stay(tenant_id=tenant.id, bed_id=bed.id, check_in=payload.check_in, agreed_monthly_rent=payload.agreed_monthly_rent)
    db.add(stay)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="This bed or tenant already has an active stay.") from exc
    db.refresh(stay)
    return stay


@app.patch("/api/stays/{stay_id}/checkout", response_model=StayResponse, tags=["allocations"])
def checkout_tenant(stay_id: int, payload: CheckoutRequest, request: Request, db: Session = Depends(get_db)) -> Stay:
    owner = current_owner(request, db)
    stay = db.scalar(select(Stay).join(Tenant).where(Stay.id == stay_id, Tenant.owner_id == owner.id, Stay.status == "active").with_for_update())
    if stay is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Active stay not found.")
    if payload.check_out < stay.check_in:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Checkout date cannot be before check-in.")
    stay.check_out = payload.check_out
    stay.status = "checked_out"
    db.commit()
    db.refresh(stay)
    return stay

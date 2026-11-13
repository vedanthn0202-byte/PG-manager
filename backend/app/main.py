from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from fastapi import Depends, FastAPI, HTTPException, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from starlette.middleware.sessions import SessionMiddleware

from .database import Base, engine, get_db, settings
from .models import Owner, Property
from .schemas import LoginRequest, OwnerCreate, OwnerResponse, PropertyCreate, PropertyResponse


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
password_hasher = PasswordHasher()
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
        password_hash=password_hasher.hash(payload.password),
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
    try:
        password_hasher.verify(owner.password_hash, payload.password)
    except VerifyMismatchError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Email or password is incorrect.") from exc
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
def list_properties(request: Request, db: Session = Depends(get_db)) -> list[Property]:
    owner = current_owner(request, db)
    return list(db.scalars(select(Property).where(Property.owner_id == owner.id, Property.active.is_(True)).order_by(Property.created_at)))


@app.post("/api/properties", response_model=PropertyResponse, status_code=status.HTTP_201_CREATED, tags=["properties"])
def create_property(payload: PropertyCreate, request: Request, db: Session = Depends(get_db)) -> Property:
    owner = current_owner(request, db)
    property_record = Property(owner_id=owner.id, name=payload.name.strip(), locality=payload.locality.strip(), city=payload.city.strip())
    db.add(property_record)
    db.commit()
    db.refresh(property_record)
    return property_record

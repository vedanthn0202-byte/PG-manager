from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class OwnerCreate(BaseModel):
    full_name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(min_length=10, max_length=128)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class OwnerResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr

    model_config = ConfigDict(from_attributes=True)


class PropertyCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    locality: str = Field(min_length=2, max_length=160)
    city: str = Field(default="Bengaluru", min_length=2, max_length=100)


class PropertyResponse(BaseModel):
    id: int
    name: str
    locality: str
    city: str
    floor_count: int
    active: bool
    created_at: datetime
    room_count: int = 0
    bed_count: int = 0
    occupied_beds: int = 0

    model_config = ConfigDict(from_attributes=True)


class RoomCreate(BaseModel):
    room_number: str = Field(min_length=1, max_length=30)
    floor_number: int = Field(default=0, ge=0, le=100)
    room_type: str = Field(default="Shared", min_length=2, max_length=40)
    bed_labels: list[str] = Field(min_length=1, max_length=20)


class BedResponse(BaseModel):
    id: int
    label: str
    monthly_rent: float | None
    available: bool


class RoomResponse(BaseModel):
    id: int
    room_number: str
    floor_number: int
    room_type: str
    capacity: int
    beds: list[BedResponse]


class TenantCreate(BaseModel):
    full_name: str = Field(min_length=2, max_length=120)
    phone: str = Field(min_length=7, max_length=30)
    email: EmailStr | None = None
    emergency_contact: str | None = Field(default=None, max_length=120)


class TenantStaySummary(BaseModel):
    id: int
    property_name: str
    room_number: str
    bed_label: str
    check_in: date
    agreed_monthly_rent: float


class TenantResponse(BaseModel):
    id: int
    full_name: str
    phone: str
    email: EmailStr | None
    emergency_contact: str | None
    created_at: datetime
    current_stay: TenantStaySummary | None = None

    model_config = ConfigDict(from_attributes=True)


class StayCreate(BaseModel):
    tenant_id: int
    bed_id: int
    check_in: date
    agreed_monthly_rent: float = Field(ge=0, le=10000000)


class StayResponse(BaseModel):
    id: int
    tenant_id: int
    bed_id: int
    check_in: date
    check_out: date | None
    agreed_monthly_rent: float
    status: str

    model_config = ConfigDict(from_attributes=True)


class CheckoutRequest(BaseModel):
    check_out: date

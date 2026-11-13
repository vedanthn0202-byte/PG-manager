from datetime import datetime

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

    model_config = ConfigDict(from_attributes=True)

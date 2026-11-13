from datetime import date, datetime, timezone

from sqlalchemy import Boolean, Date, DateTime, ForeignKey, Index, Integer, Numeric, String, Text, UniqueConstraint, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class Owner(Base):
    __tablename__ = "owners"

    id: Mapped[int] = mapped_column(primary_key=True)
    full_name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    properties: Mapped[list["Property"]] = relationship(back_populates="owner", cascade="all, delete-orphan")


class Property(Base):
    __tablename__ = "properties"

    id: Mapped[int] = mapped_column(primary_key=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("owners.id", ondelete="CASCADE"), index=True)
    name: Mapped[str] = mapped_column(String(120))
    locality: Mapped[str] = mapped_column(String(160))
    city: Mapped[str] = mapped_column(String(100), default="Bengaluru")
    address: Mapped[str | None] = mapped_column(Text, nullable=True)
    contact_number: Mapped[str | None] = mapped_column(String(30), nullable=True)
    floor_count: Mapped[int] = mapped_column(Integer, default=0)
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    owner: Mapped[Owner] = relationship(back_populates="properties")
    rooms: Mapped[list["Room"]] = relationship(back_populates="property", cascade="all, delete-orphan")


class Room(Base):
    __tablename__ = "rooms"
    __table_args__ = (UniqueConstraint("property_id", "room_number", name="uq_room_number_per_property"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    property_id: Mapped[int] = mapped_column(ForeignKey("properties.id", ondelete="CASCADE"), index=True)
    room_number: Mapped[str] = mapped_column(String(30))
    floor_number: Mapped[int] = mapped_column(Integer, default=0)
    room_type: Mapped[str] = mapped_column(String(40), default="Shared")
    capacity: Mapped[int] = mapped_column(Integer)
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    property: Mapped[Property] = relationship(back_populates="rooms")
    beds: Mapped[list["Bed"]] = relationship(back_populates="room", cascade="all, delete-orphan")


class Bed(Base):
    __tablename__ = "beds"
    __table_args__ = (UniqueConstraint("room_id", "label", name="uq_bed_label_per_room"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    room_id: Mapped[int] = mapped_column(ForeignKey("rooms.id", ondelete="CASCADE"), index=True)
    label: Mapped[str] = mapped_column(String(30))
    monthly_rent: Mapped[float | None] = mapped_column(Numeric(10, 2), nullable=True)
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    room: Mapped[Room] = relationship(back_populates="beds")
    stays: Mapped[list["Stay"]] = relationship(back_populates="bed", cascade="all, delete-orphan")


class Tenant(Base):
    __tablename__ = "tenants"

    id: Mapped[int] = mapped_column(primary_key=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("owners.id", ondelete="CASCADE"), index=True)
    full_name: Mapped[str] = mapped_column(String(120))
    phone: Mapped[str] = mapped_column(String(30))
    email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    emergency_contact: Mapped[str | None] = mapped_column(String(120), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    stays: Mapped[list["Stay"]] = relationship(back_populates="tenant", cascade="all, delete-orphan")


class Stay(Base):
    __tablename__ = "stays"
    __table_args__ = (
        Index("uq_stays_active_bed", "bed_id", unique=True, postgresql_where=text("status = 'active'"), sqlite_where=text("status = 'active'")),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    tenant_id: Mapped[int] = mapped_column(ForeignKey("tenants.id", ondelete="CASCADE"), index=True)
    bed_id: Mapped[int] = mapped_column(ForeignKey("beds.id", ondelete="RESTRICT"), index=True)
    check_in: Mapped[date] = mapped_column(Date)
    check_out: Mapped[date | None] = mapped_column(Date, nullable=True)
    agreed_monthly_rent: Mapped[float] = mapped_column(Numeric(10, 2))
    status: Mapped[str] = mapped_column(String(20), default="active", index=True)
    tenant: Mapped[Tenant] = relationship(back_populates="stays")
    bed: Mapped[Bed] = relationship(back_populates="stays")

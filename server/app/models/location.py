from sqlalchemy import Column, String, Float, Table, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base

location_category = Table(
    "location_category",
    Base.metadata,
    Column("location_id", String(255), ForeignKey("locations.id"), primary_key=True),
    Column("category_id", String(32), ForeignKey("categories.id"), primary_key=True),
)

class Location(Base):
    __tablename__ = "locations"

    id = Column(String(255), primary_key=True)
    name = Column(String(255), nullable=False)
    address = Column(String(255))
    lat = Column(Float)
    long = Column(Float)

    categories = relationship("Category", secondary=location_category, back_populates="locations")
    user_lists = relationship("UserList", back_populates="location")

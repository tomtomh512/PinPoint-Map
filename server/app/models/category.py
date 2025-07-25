from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from app.db.database import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(String(32), primary_key=True)
    name = Column(String(100), unique=True, nullable=False)

    locations = relationship("Location", secondary="location_category", back_populates="categories")

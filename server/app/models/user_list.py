import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base


def get_uuid():
    return uuid.uuid4().hex


class UserList(Base):
    __tablename__ = "user_list"

    id = Column(String(32), primary_key=True, default=get_uuid)
    user_id = Column(String(32), ForeignKey("users.id"), nullable=False)
    location_id = Column(String(255), ForeignKey("locations.id"), nullable=False)
    type = Column(String(50), nullable=False)
    date_added = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="user_lists")
    location = relationship("Location", back_populates="user_lists")

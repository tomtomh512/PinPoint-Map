from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class CategoryBase(BaseModel):
    id: str
    name: str

class UserListCreate(BaseModel):
    location_id: str
    location_name: str
    address: str
    lat: float
    long: float
    type: str  # "favorite" or "planned"
    categories: Optional[List[CategoryBase]] = []

class CategoryOut(BaseModel):
    id: str
    name: str
    primary: bool = False

class UserListOut(BaseModel):
    id: str
    name: str
    location_id: str
    address: str
    date_added: datetime
    categories: List[CategoryOut]
    lat: float
    long: float
    listing_type: str

    class Config:
        orm_mode = True

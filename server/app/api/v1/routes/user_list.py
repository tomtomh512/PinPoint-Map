from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user
from app.schemas.user_list import UserListCreate, UserListOut
from app.models.user_list import UserList
from app.models.location import Location
from app.models.category import Category
from app.models.user import User

router = APIRouter()


@router.post("/", status_code=201)
def add_user_list(
        payload: UserListCreate,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    user_id = current_user.id

    # Check required fields
    if not payload.location_name or not payload.location_id or not payload.address:
        raise HTTPException(status_code=400, detail="Missing required fields")

    # Check if item already exists for user & location & type
    existing_item = db.query(UserList).filter_by(
        user_id=user_id, location_id=payload.location_id, type=payload.type
    ).first()
    if existing_item:
        raise HTTPException(status_code=409, detail=f"{payload.location_name} is already in {payload.type}")

    # Create new UserList entry
    new_entry = UserList(
        user_id=user_id,
        location_id=payload.location_id,
        type=payload.type
    )
    db.add(new_entry)

    # Ensure Location exists or create
    location = db.query(Location).filter_by(id=payload.location_id).first()
    if not location:
        location = Location(
            id=payload.location_id,
            name=payload.location_name,
            address=payload.address,
            lat=payload.lat,
            long=payload.long
        )
        db.add(location)
    else:
        # Optionally update location info here if you want to keep it fresh
        pass

    # Handle categories
    for category_data in payload.categories:
        category = db.query(Category).filter_by(id=category_data.id).first()
        if not category:
            category = Category(id=category_data.id, name=category_data.name)
            db.add(category)
        if category not in location.categories:
            location.categories.append(category)

    db.commit()
    db.refresh(new_entry)

    return {"message": f"Location added to {payload.type}"}


@router.get("/", response_model=List[UserListOut])
def get_user_lists(
        type: Optional[str] = None,
        filters: List[str] = Query(default=[]),
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    user_id = current_user.id

    # Eager-load Location and its categories
    query = db.query(UserList).filter_by(user_id=user_id).options(
        joinedload(UserList.location).joinedload(Location.categories)
    )
    if type:
        query = query.filter(UserList.type == type)

    entries = query.all()

    # Filter in memory using eager-loaded data
    if filters:
        entries = [
            entry for entry in entries
            if entry.location and any(
                f in {cat.name for cat in entry.location.categories}
                for f in filters
            )
        ]

    results = []
    for entry in entries:
        location = entry.location
        categories = [
            {"id": cat.id, "name": cat.name, "primary": False}
            for cat in location.categories
        ] if location else []

        results.append({
            "id": entry.id,
            "name": location.name if location else "",
            "location_id": entry.location_id,
            "address": location.address if location else "",
            "date_added": entry.date_added,
            "categories": categories,
            "lat": location.lat if location else 0,
            "long": location.long if location else 0,
            "listing_type": entry.type
        })

    return results


@router.delete("/{user_list_id}")
def delete_user_list_item(
        user_list_id: str,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    user_id = current_user.id

    entry = db.query(UserList).filter_by(id=user_list_id, user_id=user_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Item not found")

    db.delete(entry)
    db.commit()

    return {"message": "Item removed successfully"}


@router.get("/categories")
def get_user_list_categories(
        type: Optional[str] = None,  # Add type as a query param
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    user_id = current_user.id

    # Filter entries by user and optional type
    query = db.query(UserList).filter(UserList.user_id == user_id)
    if type:
        query = query.filter(UserList.type == type)

    entries = query.all()

    category_set = set()
    for entry in entries:
        location = db.query(Location).filter_by(id=entry.location_id).first()
        if location:
            for category in location.categories:
                category_set.add((category.id, category.name))

    categories = [{"id": c_id, "name": c_name} for c_id, c_name in category_set]
    return {"categories": categories}

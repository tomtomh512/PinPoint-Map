from fastapi import APIRouter, Query
from app.services.here_api import search_query, search_by_id

router = APIRouter()


@router.get("/searchQuery")
def search(
        query: str = Query(...),
        lat: str = Query(...),
        long: str = Query(...),
):
    searchResults = search_query(query, lat, long, 50)
    return {"results": searchResults}


@router.get("/searchByID")
def searchByID(id: str = Query(...)):
    searchResult = search_by_id(id)
    return {"result": searchResult}

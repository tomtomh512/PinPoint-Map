import os
import requests
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("HERE_API_KEY")


def search_query(query_search: str, lat: str, long: str, limit: int):
    params = {
        "at": f"{lat},{long}",
        "limit": limit,
        "q": query_search,
        "apiKey": API_KEY,
    }

    url = "https://discover.search.hereapi.com/v1/discover"

    response = requests.get(url, params=params)
    if response.status_code == 200:
        data = response.json()
        return [{
            "name": item.get("title"),
            "location_id": item.get("id"),
            "address": item.get("address", {}).get("label"),
            "lat": item.get("position", {}).get("lat"),
            "long": item.get("position", {}).get("lng"),
            "categories": item.get("categories", []),
            "contacts": item.get("contacts", []),
            "hours": item.get("openingHours", []),
            "listing_type": "search",
        } for item in data.get("items", [])]
    else:
        return []


def search_by_id(here_id: str):
    params = {
        "id": here_id,
        "apiKey": API_KEY,
    }

    url = "https://lookup.search.hereapi.com/v1/lookup"

    response = requests.get(url, params=params)
    if response.status_code == 200:
        item = response.json()
        return {
            "name": item.get("title"),
            "location_id": item.get("id"),
            "address": item.get("address", {}).get("label"),
            "lat": item.get("position", {}).get("lat"),
            "long": item.get("position", {}).get("lng"),
            "categories": item.get("categories", []),
            "contacts": item.get("contacts", []),
            "hours": item.get("openingHours", []),
        }
    else:
        return {}
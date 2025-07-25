from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.routes import auth, here_api, user_list

# from .db.database import engine, Base
# Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include versioned API routers
app.include_router(auth.router, prefix="/api/v1/auth")
app.include_router(here_api.router, prefix="/api/v1/here")
app.include_router(user_list.router, prefix="/api/v1/userlist", tags=["UserList"])
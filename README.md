# PinPoint

A map application for exploring and saving locations
<img src="/assets/img.png">

## Features

- Interactive map – Look up points of interest with an interactive map
- Location search - Quickly find locations and view detailed information
- Save locations – Create an account to be able to save locations to lists

## Technologies & Implementation
- Frontend – React 
- Backend API – FastAPI 
- Location Data – [HERE API](https://www.here.com/)
- Map Rendering – [Leaflet](https://leafletjs.com/)
- Authentication – JSON Web Tokens (JWT)
- Database Management – SQLAlchemy ORM

## Local Development

### Environment Variables
On the backend server, create a `.env` file with the following contents:
```
SECRET_KEY="your_secret_key_here"
HERE_API_KEY="your_here_api_key_here"
```

### Backend

1. Navigate to the backend directory
```
cd server
```
2. Create and activate a virtual environment
```
python -m venv venv
source venv/bin/activate       # On Windows: venv\Scripts\activate
```
3. Install dependencies
```
pip install -r requirements.txt
```
4. Run the FastAPI server
```
uvicorn main:app --reload
```

### Frontend

1. Navigate to the frontend directory
```
cd client
```
2. Install dependencies
```
npm install
# or
yarn install
```
3. Start the React app
```
npm start
# or
yarn start
```
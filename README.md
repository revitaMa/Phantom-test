# Phantom test overview

A full-stack project built with React+Flask as part of a home assignment for Phantom Technologies.
The app implements user authentication, displays an order table and shows order details in a modal.

Architecture: React client calss Flask backend via api. The backend talks to an external API.

# Tech stack

## Dependencies

- Python 3.10+
  https://www.python.org/downloads/
- Node.js 18+ and npm
  https://nodejs.org/en/download

## Getting started

### backend setup

Open powershell window. Run in project root:

```powershell
cd backend
python -m venv .venv
# for windows:
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy -Item .env.example .env
# Notice that .env should be encoded as UTF-8
flask run
# Make sure flask is running on port 5000
```

### frontend setup

open new powershell window.
Run in project root:

```
cd frontend
npm install
npm run dev
```

## Environment variables

Make sure backend/.env was created and encoded to UTF-8.
It should look the same as .env.example

## Running program

Open app at: http://localhost:5173

## Known issues

Right now there's no unit testing, loading spinner and poor UI

## Production notes

In a real production system I would:

- Enable CORS on the backend, instead of relying on Vite proxy.
- Set cookies as HttpOnly + Secure, consider adding CSRF protection to state-changing requests (POST/PUT/DELETE), and validate token against upstream API to ensure it's still valid.
- Add unit testings, structured error handling and logging.

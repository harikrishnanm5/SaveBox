from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
import os
import secrets
import hashlib
from dotenv import load_dotenv
import requests

# Load environment variables from .env file
load_dotenv()

# Supabase Configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", os.getenv("SUPABASE_ANON_KEY"))

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoginRequest(BaseModel):
    phone_number: str
    name: Optional[str] = None

# --- Supabase REST Helper ---
def supabase_request(method, endpoint, data=None):
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("[CRITICAL] Missing Supabase URL or Key.")
        return None
    
    url = f"{SUPABASE_URL}/rest/v1/{endpoint}"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation" 
    }
    
    try:
        if method == "GET":
            response = requests.get(url, headers=headers, params=data)
        elif method == "POST":
            response = requests.post(url, headers=headers, json=data)
        elif method == "PATCH":
            response = requests.patch(url, headers=headers, json=data)
        else:
            return None
            
        print(f"[SUPABASE REST] {method} {endpoint} -> {response.status_code}")
        if response.status_code >= 400:
             print(f"[SUPABASE REST ERROR] {response.text}")
        
        return response
    except Exception as e:
        print(f"[SUPABASE REST EXCEPTION] {e}")
        return None

@app.post("/login")
async def login_user(request: LoginRequest):
    phone_number = request.phone_number
    # Normalize
    if not phone_number.startswith('+'):
        phone_number = f"+91{phone_number}"
    
    # --- DB Logic via REST ---
    raw_phone = request.phone_number # Use raw input for consistency or normalized? 
    # Let's use normalized for backend consistency if previously we verified normalized numbers.
    # Actually, let's stick to the hash logic we established: Hashing the RAW input from frontend?
    # Wait, in the previous code I had:
    # raw_phone = request.phone_number 
    # phone_hash = hashlib.sha256(raw_phone.encode()).hexdigest()
    # So I will keep using request.phone_number (which comes from JSON).
    
    raw_phone_for_hash = request.phone_number
    phone_hash = hashlib.sha256(raw_phone_for_hash.encode()).hexdigest()
    
    try:
        # 1. Check if user exists (GET /users?phone_hash=eq.HASH)
        get_res = supabase_request("GET", "users", {"phone_hash": f"eq.{phone_hash}"})
        
        if not get_res:
                raise HTTPException(status_code=500, detail="Database connection failed.")
        
        users = get_res.json()
        user = None
        
        if users and len(users) > 0:
            # Update Existing
            user = users[0]
            update_payload = {"last_login": "now()"}
            # if request.name:
            #     update_payload["name"] = request.name
            
            # PATCH /users?id=eq.ID
            upd_res = requests.patch(
                f"{SUPABASE_URL}/rest/v1/users", 
                headers={
                    "apikey": SUPABASE_KEY,
                    "Authorization": f"Bearer {SUPABASE_KEY}",
                    "Content-Type": "application/json",
                    "Prefer": "return=representation" 
                },
                params={"id": f"eq.{user['id']}"},
                json=update_payload
            )
            if upd_res.status_code < 400:
                    user = upd_res.json()[0]
        else:
            # Create New
            print(f"[DB] Creating new user for hash {phone_hash[:8]}...")
            new_payload = {"phone_hash": phone_hash}
            # if request.name:
            #    new_payload["name"] = request.name
            
            post_res = supabase_request("POST", "users", new_payload)
            if post_res and post_res.status_code == 201:
                user = post_res.json()[0]
                # Create Savings Account
                supabase_request("POST", "savings_accounts", {"user_id": user['id'], "balance": 0})
            else:
                raise Exception(f"Failed to create user: {post_res.text if post_res else 'No Response'}")

        return {
            "message": "Login successful", 
            "token": "dummy_jwt_token",
            "user": user 
        }
        
    except Exception as e:
        print(f"[DB ERROR] {e}")
        raise HTTPException(status_code=500, detail="Login failed during secure verification.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)

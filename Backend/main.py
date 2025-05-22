# Example: main.py
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from generate.claudai import ask_claude

import os

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/generate")
async def generate(request: Request):
    data = await request.json()
    prompt = data.get("prompt")
    code = ask_claude(prompt) 
    return {"code": code}
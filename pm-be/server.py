import os
import uuid

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from livekit.api import AccessToken, VideoGrants, RoomAgentDispatch, RoomConfiguration

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/token")
async def get_token(request: Request):
    body = await request.json()

    room_name = body.get("room_name") or f"room-{uuid.uuid4().hex[:8]}"
    identity = body.get("participant_identity") or f"user-{uuid.uuid4().hex[:8]}"

    token = (
        AccessToken(os.getenv("LIVEKIT_API_KEY"), os.getenv("LIVEKIT_API_SECRET"))
        .with_identity(identity)
        .with_grants(VideoGrants(room_join=True, room=room_name))
        .with_room_config(
            RoomConfiguration(
                agents=[RoomAgentDispatch(agent_name="my-agent")]
            )
        )
        .to_jwt()
    )

    return JSONResponse(
        {"server_url": os.getenv("LIVEKIT_URL"), "participant_token": token}
    )

import json
from pathlib import Path

from dotenv import load_dotenv
from livekit import agents
from livekit.agents import AgentServer, AgentSession, Agent, room_io
from livekit.plugins import noise_cancellation, silero, deepgram, google, cartesia
from livekit.plugins.turn_detector.english import EnglishModel

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

PROMPT = (Path(__file__).resolve().parent.parent / "prompts" / "CLOUD_9_SYSTEM_PROMPT.md").read_text()
TBI_KNOWLEDGE = (Path(__file__).resolve().parent.parent / "prompts" / "TBI_KNOWLEDGE.md").read_text()
STORIES = (Path(__file__).resolve().parent.parent / "prompts" / "STORIES.md").read_text()

server = AgentServer()


@server.rtc_session(agent_name="my-agent")
async def my_agent(ctx: agents.JobContext):
    await ctx.connect()

    # Read mood/activity from room metadata (set by token server via RoomConfiguration)
    mood = ""
    activity = ""
    room_metadata = ctx.room.metadata
    if room_metadata:
        print(f"[CLOUD9] room metadata: {room_metadata}")
        metadata = json.loads(room_metadata)
        mood = metadata.get("mood", "")
        activity = metadata.get("activity", "")
    else:
        print("[CLOUD9] No room metadata found")

    participant = await ctx.wait_for_participant()

    context = ""
    if mood:
        context += f"The user said they are feeling: {mood}.\n"
    if activity:
        context += f"The user chose this activity: {activity}.\n"

    base_prompt = PROMPT + "\n\n" + TBI_KNOWLEDGE
    if activity == "Memory":
        base_prompt += "\n\n" + STORIES
    instructions = context + base_prompt if context else base_prompt

    class Assistant(Agent):
        def __init__(self) -> None:
            super().__init__(instructions=instructions)

    session = AgentSession(
        preemptive_generation=True,
        turn_detection=EnglishModel(),
        stt=deepgram.STT(model="nova-3"),  # Direct Deepgram, uses DEEPGRAM_API_KEY
        llm=google.LLM(model="gemini-2.5-flash"),    # Direct Google, uses GOOGLE_API_KEY
        tts=cartesia.TTS(
            model="sonic-3",
            # voice="f786b574-daa5-4673-aa0c-cbe3e8534c02" # Katie cartesia voice
            voice="e8e5fffb-252c-436d-b842-8879b84445b6" # Cathy cartesia voice
        ), 
        vad=silero.VAD.load(),
    )

    await session.start(
        room=ctx.room,
        agent=Assistant(),
        room_options=room_io.RoomOptions(
            audio_input=room_io.AudioInputOptions(
                noise_cancellation=noise_cancellation.BVC(),
            ),
        ),
    )

    if mood:
        greeting = f"Hi there. I hear you are feeling {mood.lower()}. I am here for you. What would you like to do?"
    else:
        greeting = "Hi there. I am here for you. What would you like to do?"

    await session.say(greeting, allow_interruptions=False)


if __name__ == "__main__":
    agents.cli.run_app(server)

"use client";

import { useState } from "react";
import {
  ControlBar,
  RoomAudioRenderer,
  useSession,
  SessionProvider,
  useAgent,
  BarVisualizer,
} from "@livekit/components-react";
import { TokenSource } from "livekit-client";
import "@livekit/components-styles";

const tokenSource = TokenSource.endpoint("http://localhost:8000/token");

function AgentView() {
  const agent = useAgent();
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm text-zinc-500">Agent state: {agent.state}</p>
      <div className="h-48 w-full max-w-md">
        {agent.microphoneTrack && (
          <BarVisualizer trackRef={agent.microphoneTrack} state={agent.state} />
        )}
      </div>
    </div>
  );
}

function RoomContent({ onDisconnect }: { onDisconnect: () => void }) {
  return (
    <div className="flex flex-col items-center gap-6">
      <AgentView />
      <ControlBar controls={{ microphone: true, camera: false }} />
      <RoomAudioRenderer />
      <button
        onClick={onDisconnect}
        className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
      >
        Disconnect
      </button>
    </div>
  );
}

export default function AgentTestPage() {
  const session = useSession(tokenSource, { agentName: "my-agent" });
  const [started, setStarted] = useState(false);

  const handleConnect = () => {
    session.start();
    setStarted(true);
  };

  const handleDisconnect = () => {
    session.end();
    setStarted(false);
  };

  return (
    <SessionProvider session={session}>
      <div
        data-lk-theme="default"
        className="flex min-h-screen flex-col items-center justify-center gap-8"
      >
        <h1 className="text-2xl font-semibold">Voice Agent Test</h1>
        {!started ? (
          <button
            onClick={handleConnect}
            className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
          >
            Connect to Agent
          </button>
        ) : (
          <RoomContent onDisconnect={handleDisconnect} />
        )}
      </div>
    </SessionProvider>
  );
}

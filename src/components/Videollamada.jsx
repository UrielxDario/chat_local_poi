import {
  StreamVideo,
  StreamCall,
  StreamVideoClient,
  useCall,
  useCallStateHooks,
  CallingState,
} from '@stream-io/video-react-sdk';
import React, { useEffect, useState } from 'react';

const apiKey = 'qy9c2x5ggknp';
const userId = 'luiscar03';
const token = StreamVideoClient.devToken(userId);
const callId = 'call-ejemplo';

const user = {
  id: userId,
  name: 'Mi Usuario',
  image: 'https://getstream.io/random_svg/?id=usuario&name=Usuario',
};

const client = new StreamVideoClient({ apiKey, user, token });
const call = client.call('default', callId);

function VideoCallUI() {
  const { useCallCallingState, useParticipantCount } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participantCount = useParticipantCount();

  if (callingState !== CallingState.JOINED) {
    return <div>Conectando a la llamada...</div>;
  }

  return (
    <div>
      Llamada "{call?.id}" con {participantCount} participantes
    </div>
  );
}

function VideoCall() {
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    const joinCall = async () => {
      await call.join({ create: true });
      setJoined(true);
    };
    joinCall();
  }, []);

  if (!joined) {
    return <div>Uniéndose a la llamada...</div>;
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <VideoCallUI />
      </StreamCall>
    </StreamVideo>
  );
}

export default VideoCall;

import {
  StreamVideo,
  StreamCall,
  StreamVideoClient,
  useCallStateHooks,
  CallingState,
  SpeakerLayout,
  CallControls,
  CallParticipantsList,
} from '@stream-io/video-react-sdk';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; 
import axios from 'axios';


const apiKey = 'qy9c2x5ggknp';
//const userId = 'luiscar03';

function VideoCallUI() {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) {
    return <div>Conectando a la llamada...</div>;
  }

  return (
    <div style={{ padding: '1rem' }}>
      <SpeakerLayout />
      <CallControls />
      <CallParticipantsList />
    </div>
  );
}

function VideoCall() {
  const { callId } = useParams(); 
  const [token, setToken] = useState(null);
  const [joined, setJoined] = useState(false);
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);


  const navigate = useNavigate();

    const handleHangUp = async () => {
    if (call) {
        await call.leave();
        navigate(`/chat/${callId}`); // <-- redirige al chat del que vino la llamada
    }
    };


  useEffect(() => {
  const fetchTokenAndJoinCall = async () => {
    try {
      const res = await axios.post('http://localhost:3001/api/token', { userId });
      const fetchedToken = res.data.token;

      const user = {
        id: userId,
        name: 'Mi Usuario',
        image: 'https://getstream.io/random_svg/?id=usuario&name=Usuario',
      };

      const videoClient = new StreamVideoClient({ apiKey, user, token: fetchedToken });
      const newCall = videoClient.call('default', callId);
      await newCall.join({ create: true });

      setToken(fetchedToken);
      setClient(videoClient);
      setCall(newCall);
      setJoined(true);
    } catch (error) {
      console.error('Error al obtener token o unirse a la llamada:', error);
    }
  };

  if (callId) {
    fetchTokenAndJoinCall();
  }

  //  Cleanup cuando se desmonta el componente
  return () => {
    if (call) {
      call.leave();
      console.log('Call finalizada correctamente');
    }
  };
}, [callId, call]);



  if (!token || !client || !call || !joined) {
    return <div>Uniéndose a la videollamada...</div>;
  }

  return (
     <StreamVideo client={client}>
    <StreamCall call={call}>
      <VideoCallUI />
      <div className="flex justify-center mt-4">
        <button
          onClick={handleHangUp}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          🚫 Colgar
        </button>
      </div>
    </StreamCall>
  </StreamVideo>
  );
}

export default VideoCall;
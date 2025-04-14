import React, { useEffect, useRef, useState, useContext, useCallback } from 'react';
import { io } from 'socket.io-client';
import Peer from 'peerjs';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const VideoCall = ({ sessionId, isTutor }) => {
    const { userData, backendUrl } = useContext(AppContent);
    const [peer, setPeer] = useState(null);
    const [socket, setSocket] = useState(null);
    const [stream, setStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [sessionStartTime, setSessionStartTime] = useState(null);
    const [rating, setRating] = useState(5);
    const [review, setReview] = useState('');

    const myVideo = useRef();
    const remoteVideo = useRef();

    const connectToNewUser = useCallback((userId, currentStream) => {
        if (!peer) return;
        const call = peer.call(userId, currentStream);
        call.on('stream', remoteVideoStream => {
            if (remoteVideo.current) {
                remoteVideo.current.srcObject = remoteVideoStream;
                setRemoteStream(remoteVideoStream);
            }
        });
    }, [peer]);

    useEffect(() => {
        let currentSocket = null;
        let currentPeer = null;
        let currentStream = null;
        let currentRemoteStream = null;

        // Initialize Socket.IO
        const newSocket = io(backendUrl);
        currentSocket = newSocket;
        setSocket(newSocket);

        // Initialize PeerJS
        const newPeer = new Peer(undefined, {
            host: 'localhost',
            port: 9000,
            path: '/tutoring'
        });
        currentPeer = newPeer;
        setPeer(newPeer);

        // Get user's media stream
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then(mediaStream => {
            currentStream = mediaStream;
            setStream(mediaStream);
            if (myVideo.current) {
                myVideo.current.srcObject = mediaStream;
            }

            // Answer incoming calls
            newPeer.on('call', call => {
                call.answer(mediaStream);
                call.on('stream', remoteVideoStream => {
                    currentRemoteStream = remoteVideoStream;
                    if (remoteVideo.current) {
                        remoteVideo.current.srcObject = remoteVideoStream;
                        setRemoteStream(remoteVideoStream);
                    }
                });
            });

            // Handle new user connection
            newSocket.on('user-connected', userId => {
                connectToNewUser(userId, mediaStream);
            });
        });

        // When peer is ready, join room
        newPeer.on('open', id => {
            newSocket.emit('join-room', sessionId, id);
            setSessionStartTime(new Date());
        });

        return () => {
            currentStream?.getTracks().forEach(track => track.stop());
            currentRemoteStream?.getTracks().forEach(track => track.stop());
            currentSocket?.disconnect();
            currentPeer?.destroy();
        };
    }, [sessionId, backendUrl, connectToNewUser]);

    const handleEndSession = async () => {
        if (!sessionStartTime) return;

        const duration = Math.round((new Date() - sessionStartTime) / 60000); // Convert to minutes
        
        try {
            const response = await axios.post(`${backendUrl}/api/user/end-session`, {
                sessionId,
                duration,
                rating,
                review
            });

            if (response.data.success) {
                toast.success('Session ended successfully');
                // Clean up streams
                stream?.getTracks().forEach(track => track.stop());
                remoteStream?.getTracks().forEach(track => track.stop());
                socket?.disconnect();
                peer?.destroy();
            }
        } catch (error) {
            toast.error('Error ending session');
            console.error(error);
        }
    };

    return (
        <div className="video-call-container">
            <div className="videos-grid">
                <div className="video-box">
                    <video ref={myVideo} autoPlay playsInline muted />
                    <p>{userData?.firstname} (You)</p>
                </div>
                <div className="video-box">
                    <video ref={remoteVideo} autoPlay playsInline />
                    <p>Remote User</p>
                </div>
            </div>
            
            <div className="session-controls">
                {!isTutor && (
                    <div className="rating-section">
                        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                            {[1,2,3,4,5].map(num => (
                                <option key={num} value={num}>{num} Stars</option>
                            ))}
                        </select>
                        <textarea
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder="Write your review..."
                        />
                    </div>
                )}
                <button onClick={handleEndSession} className="end-session-btn">
                    End Session
                </button>
            </div>
        </div>
    );
};

export default VideoCall;
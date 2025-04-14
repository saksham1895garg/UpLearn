import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import VideoCall from '../components/VideoCall';
import Navbar from '../components/navbar';
import axios from 'axios';
import { toast } from 'react-toastify';

const TutoringSession = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const { userData, backendUrl } = useContext(AppContent);
    const [sessionData, setSessionData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSessionData = async () => {
            try {
                if (!sessionId) return;
                
                const response = await axios.post(`${backendUrl}/api/user/join-video-session/${sessionId}`);
                if (response.data.success) {
                    setSessionData(response.data);
                    setIsLoading(false);
                }
            } catch (error) {
                toast.error(error.response?.data?.message || 'Error joining session');
                navigate('/');
            }
        };

        fetchSessionData();
    }, [sessionId, backendUrl, navigate]);

    if (isLoading) {
        return (
            <div>
                <Navbar />
                <div className="loading-container">
                    <h2>Joining session...</h2>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className="tutoring-session-container">
                <div className="session-header">
                    <h1>{sessionData?.title || 'Tutoring Session'}</h1>
                    {userData?.isTutor ? (
                        <span className="role-badge tutor">Tutor</span>
                    ) : (
                        <span className="role-badge student">Student</span>
                    )}
                </div>

                <VideoCall 
                    sessionId={sessionId} 
                    isTutor={userData?.isTutor} 
                />
            </div>
        </div>
    );
};

export default TutoringSession;
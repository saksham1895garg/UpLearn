import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { AppContent } from './AppContext.js';

axios.defaults.withCredentials = true;

export const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [isLoggedin, setisLoggedin] = useState(false);
    const [userData, setUserData] = useState(false);

    const getUserData = useCallback(async() => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/data');
            if (data.success) {
                setUserData(data.userData);
                setisLoggedin(true);
            } else {
                setUserData(false);
                setisLoggedin(false);
                toast.error(data.message);
            }
        } catch (error) {
            setUserData(false);
            setisLoggedin(false);
            console.error(error.message);
        }
    }, [backendUrl]);

    const value = {
        backendUrl,
        isLoggedin, setisLoggedin,
        userData, setUserData,
        getUserData
    }

    // Add initial auth check
    useEffect(() => {
        const checkAuth = async () => {
            try {
                console.log('Checking authentication status...');
                const { data } = await axios.post(backendUrl + '/api/auth/is-auth');
                console.log('Auth check response:', data);
                if (data.success) {
                    setisLoggedin(true);
                    getUserData();
                }
            } catch (error) {
                console.log('Auth check failed:', error.message);
                setisLoggedin(false);
                setUserData(false);
            }
        };
        checkAuth();
    }, [backendUrl, getUserData]);

    // Existing effect for login state changes
    useEffect(() => {
        if (isLoggedin) {
            getUserData();
        }
    }, [isLoggedin, getUserData]);

    return (
        <AppContent.Provider value={value}>
            {props.children}
        </AppContent.Provider>
    )
}
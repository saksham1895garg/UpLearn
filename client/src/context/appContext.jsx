import axios from 'axios';
import {createContext, useState, useEffect, useCallback} from 'react';
import {toast} from 'react-toastify';
export const AppContent = createContext();

axios.defaults.withCredentials = true;

export const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [isLoggedin, setisLoggedin] = useState(false);
    const [userData, setUserData] = useState(false);

    const getUserData = useCallback(async() => {
        try {
            console.log('Calling getUserData');
            console.log('Backend URL:', backendUrl + '/api/user/data');
            const { data } = await axios.get(backendUrl + '/api/user/data');
            console.log('API Response:', data);
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

    useEffect(() => {
        if (isLoggedin) {
            getUserData();
        }
    }, [isLoggedin, getUserData]);

    return(
        <AppContent.Provider value={value}>
            {props.children}
        </AppContent.Provider>
    )
}
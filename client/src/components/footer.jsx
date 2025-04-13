import React from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
    const navigate = useNavigate();
    const currentyear = new Date().getFullYear();
    return(
        <div className="footer-inner">
            <p>© {currentyear} <span onClick={()=>navigate('/')}>UniSathi</span>. All rights reserved.</p>
        </div>
    )
}

export default Footer
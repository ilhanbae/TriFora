import React from 'react';
import { useNavigate } from 'react-router-dom';

// back button component
const BackButton = () => {
    const navigate = useNavigate();

    return (
        // display arrow
        // -1 in navigate means go back one
        <button className="base" onClick={() => navigate(-1)}>
            ← Back
        </button>
    )
};

export default BackButton;
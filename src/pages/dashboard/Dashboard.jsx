import React from 'react'
import './dash.css'
import { useAuth } from '@clerk/clerk-react';

const Dashboard = () => {

    const { userId } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const text = e.target.text.value;
        if (!text) return;

        await fetch("http://localhost:3000/api/chats", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, text })
        })
    }

    return (
        <div className='dashboardPage'>
            <div className='texts'>
                <div className='logo'>
                    <h1>AI NEXUS</h1>
                </div>
                <div className="options">
                    <div className='option'>
                        <img src="/chat.png" alt="" />
                        <span>Create a new Chat</span>
                    </div>
                    <div className='option'>
                        <img src="/image.png" alt="" />
                        <span>Analyze images</span>
                    </div>
                    <div className='option'>
                        <img src="/help.png" alt="" />
                        <span>Help me with my code</span>
                    </div>
                </div>
            </div>
            <div className='formContainer'>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder='Type your message here...' name='text' />
                    <button>
                        <img src="/arrow.png" className="arrow" />
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Dashboard
import React from 'react'
import './dash.css'

const Dashboard = () => {
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
                <form action="">
                    <input type="text" placeholder='Type your message here...' />
                    <button>
                        <img src="/arrow.png" className="arrow" />
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Dashboard
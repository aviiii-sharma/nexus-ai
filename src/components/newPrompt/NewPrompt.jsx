import React, { useEffect, useRef } from 'react'
import './prompt.css'

const NewPrompt = () => {

    const endRef = useRef(null);

    useEffect(() => {
        endRef.current.scrollIntoView({ behavior: 'smooth' }, [])

    })
    return (
        <>
            {/* Add new Chat */}

            <div className='endChat' ref={endRef}>
                <div className='container'>
                    <hr className='hr-text' data-content="End of the Chat" />
                </div>
            </div>
            <form action="" className='newForm'>
                <label htmlFor="file">
                    <img src="/link.png" alt="" />
                </label>
                <input id='file' type="file" multiple={false} hidden />
                <input type="text" placeholder='Type your message here...' />
                <button>
                    <img src="/arrow.png" className="arrow" />
                </button>
            </form>
        </>
    )
}

export default NewPrompt
import React, { useEffect, useRef, useState } from 'react'
import './prompt.css'
import Upload from '../upload/Upload';
import { IKImage } from "imagekitio-react";

const NewPrompt = () => {

    const [img, setImg] = useState({
        isLoading: false,
        error: "",
        dbData: {}

    })

    const endRef = useRef(null);

    useEffect(() => {
        endRef.current.scrollIntoView({ behavior: 'smooth' }, [])

    })
    return (
        <>
            {/* Add new Chat */}
            {img.isLoading && <div className='loading'>Loading...</div>}
            {img.dbData?.filePath && (
                <IKImage
                    urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                    path={img.dbData?.filePath}
                    width="150"
                />
            )}
            <div className='endChat' ref={endRef}>
                <div className='container'>
                    <hr className='hr-text' data-content="End of the Chat" />
                </div>
            </div>
            <form action="" className='newForm'>
                <Upload setImg={setImg} />
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
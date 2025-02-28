import { useEffect, useRef, useState } from 'react'
import './prompt.css'
import Upload from '../upload/Upload';
import { IKImage } from "imagekitio-react";
import model from '@/lib/gemini';
import Markdown from 'react-markdown';
import { Loader } from 'rsuite';

const NewPrompt = () => {

    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");

    const [img, setImg] = useState({
        isLoading: false,
        error: "",
        dbData: {},
        aiData: {}

    });
    const chat = model.startChat({
        history: [
            {
                role: "user",
                parts: [{
                    text: "Hello i have a white cat"
                }],
            }, {
                role: "model",
                parts: [{
                    text: "Hello, how can I help you today?"
                }],
            }
        ],
        generationConfig: {
            // maxOutputTokens: 100,
        }
    })

    const endRef = useRef(null);

    useEffect(() => {
        endRef.current.scrollIntoView({ behavior: 'smooth' }, [question, answer, img.dbData]);

    })

    const add = async (text) => {

        setQuestion(text);
        const result = await chat.sendMessageStream(Object.entries(img.dbData).length ? [img.aiData, text] : [text]);

        let accumulatedText = "";
        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            console.log(chunkText);
            accumulatedText += chunkText;
            setAnswer(accumulatedText);
        }

        setImg({
            isLoading: false,
            error: "",
            dbData: {},
            aiData: {}
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const text = e.target.text.value;
        if (!text) return;

        add(text);

        

    }
    return (
        <>
            {/* Add new Chat */}
            {img.isLoading && (
                <div className="loading">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            )}
            {img.dbData?.filePath && (
                <IKImage
                    urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                    path={img.dbData?.filePath}
                    width="150"
                />
            )}
            {question && <div className='message user'>{question} </div>}
            {answer && <div className='message '>
                <Markdown>
                    {answer}
                </Markdown>
            </div>}

            <div className='endChat' ref={endRef}>
                <div className='container'>
                    <hr className='hr-text' data-content="End of the Chat" />
                </div>
            </div>



            <form className='newForm' onSubmit={handleSubmit}>
                <Upload setImg={setImg} />
                <input id='file' type="file" multiple={false} hidden />
                <input type="text" placeholder='Type your message here...' name='text' />
                <button>
                    <img src="/arrow.png" className="arrow" />
                </button>
            </form>
        </>
    )
}

export default NewPrompt
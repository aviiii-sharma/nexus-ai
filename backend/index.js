import express from 'express';
import ImageKit from 'imagekit';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import UserChats from './models/userChats.js';
import Chat from './models/chat.js';



dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO)
        console.log('Connected to MongoDB')
    } catch (err) {
        console.log(err)
    }
}


const imagekit = new ImageKit({
    urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
});


app.get('/api/upload', (req, res) => {
    const result = imagekit.getAuthenticationParameters();
    res.send(result);
})

app.post('/api/chats', async (req, res) => {

    const { userId, text } = req.body;

    try {
        // create a new chat
        const newChat = new Chat({
            userId: userId,
            history: [{
                role: "user", parts: [{
                    text
                }]
            }]
        })
        const savedChat = await newChat.save();

        // find userChats
        const userChats = await UserChats.find({ userId });

        // if user has no chats, create new one


        if (!userChats.length) {
            const newUserChat = new UserChats({
                userId,
                chats: [
                    {
                        _id: savedChat._id,
                        title: text.substring(0, 30)
                    }
                ]
            })
            await newUserChat.save();
        } else {
            //if user exists already
            await userChats.updateOne({
                userId
            },
                {
                    $push: {
                        chats: {
                            _id: savedChat._id,
                            title: text.substring(0, 30),
                        }
                    }
                }
            );
            res.status(201).send(newChat._id);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }

})



app.listen(port, () => {
    connect();
    console.log(`Server is running on port ${port}`);
})
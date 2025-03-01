import express from 'express';
import ImageKit from 'imagekit';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import UserChats from './models/userChats.js';
import Chat from './models/chat.js';
import { ClerkExpressRequireAuth, ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';



dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));

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

app.post('/api/chats', ClerkExpressRequireAuth(), async (req, res) => {
    const userId = req.auth.userId;
    const { text } = req.body;

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
            await UserChats.updateOne({
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

app.get('/api/userchats', ClerkExpressWithAuth(), async (req, res) => {
    const userId = req.auth.userId;

    try {
        const userChats = await UserChats.find({ userId });

        if (!userChats) {
            return res.status(404).send('No chats found');
        }

        // console.log(userChats);
        res.status(200).send(userChats[0].chats);

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
})

app.use((err, req, res) => {
    console.error(err.stack);
    res.status(401).send('Something broke!');
})



app.listen(port, () => {
    connect();
    console.log(`Server is running on port ${port}`);
})
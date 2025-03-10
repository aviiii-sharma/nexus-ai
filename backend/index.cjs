const express = require('express');
const ImageKit = require('imagekit');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const { fileURLToPath } = require('url');
const UserChats = require('./models/userChats.js');
const Chat = require('./models/chat.js');
const { ClerkExpressRequireAuth, ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');

dotenv.config();

const app = express();

// Get __dirname in CommonJS
const __filename = __filename || fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);

// MongoDB Connection
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB');
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err);
    }
};

const imagekit = new ImageKit({
    urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
});

// API Routes
app.get('/api/upload', (req, res) => {
    const result = imagekit.getAuthenticationParameters();
    res.send(result);
});

app.post('/api/chats', ClerkExpressRequireAuth(), async (req, res) => {
    const userId = req.auth.userId;
    const { text } = req.body;

    try {
        const newChat = new Chat({
            userId: userId,
            history: [{ role: 'user', parts: [{ text }] }],
        });
        const savedChat = await newChat.save();

        const userChats = await UserChats.find({ userId }).lean();

        if (!userChats.length) {
            const newUserChat = new UserChats({
                userId,
                chats: [{ _id: savedChat._id, title: text.substring(0, 30) }],
            });
            await newUserChat.save();
        } else {
            await UserChats.updateOne(
                { userId },
                {
                    $push: {
                        chats: {
                            _id: savedChat._id,
                            title: text.substring(0, 30),
                        },
                    },
                }
            );
        }
        res.status(201).send(newChat._id);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.get('/api/userchats', ClerkExpressWithAuth(), async (req, res) => {
    const userId = req.auth.userId;

    try {
        const userChats = await UserChats.findOne({ userId }).lean();

        if (!userChats) {
            return res.status(404).send('No chats found');
        }
        res.status(200).send(userChats.chats);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.get('/api/chats/:id', ClerkExpressWithAuth(), async (req, res) => {
    const userId = req.auth.userId;

    try {
        const chat = await Chat.findOne({ _id: req.params.id, userId }).lean();

        if (!chat) {
            return res.status(404).send('No chats found');
        }
        res.status(200).send(chat);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.put('/api/chats/:id', ClerkExpressWithAuth(), async (req, res) => {
    const userId = req.auth.userId;
    const { question, answer, img } = req.body;

    const newItems = [
        ...(question ? [{ role: 'user', parts: [{ text: question }], ...(img && { img }) }] : []),
        { role: 'model', parts: [{ text: answer }] },
    ];

    try {
        const updatedChat = await Chat.updateOne(
            { _id: req.params.id, userId },
            { $push: { history: { $each: newItems } } }
        );
        res.status(200).send(updatedChat);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
    next();
});

// Serve Static Files
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});
app.use(express.static(path.join(__dirname, '../public')));

// Security Headers
// app.use((req, res, next) => {
//     res.setHeader(
//         'Content-Security-Policy',
//         "default-src 'self'; font-src 'self' https://ainexus-backend.vercel.app;"
//     );
//     next();
// });

// ✅ Export `app` instead of `app.listen()`
module.exports = app;
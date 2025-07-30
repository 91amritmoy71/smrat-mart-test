require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const router = require('./routes/router'); 

const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(express.json());
app.use("/api", router);

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log("Mongo error:", err));
    

const PORT = process.env.PORT || 5600;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

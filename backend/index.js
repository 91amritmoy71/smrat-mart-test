require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const connectdb = require('./config/db');
const router = require('./routes/router'); 

connectdb();
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(express.json());
app.use("/api", router);
  

const PORT = process.env.PORT || 5600;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

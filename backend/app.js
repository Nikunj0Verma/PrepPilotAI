// Using Node.js `require()`
const mongoose = require('mongoose');
require('dotenv').config();
const authRouter = require('./routes/authRouter');
const interviewRouter = require('./routes/interviewRouter');
const express = require('express');
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());

// // Using ES6 imports
// import mongoose from 'mongoose';

app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);
 
mongoose
.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log(err)); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 
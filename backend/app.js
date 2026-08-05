// Using Node.js `require()`
const mongoose = require('mongoose');

// // Using ES6 imports
// import mongoose from 'mongoose';

require('dotenv').config();

mongoose
.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log(err)); 
const API_URL  = "http://localhost:3000/api/video"; 

const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const video = new Schema({
  name: { 
    type: String,
    trim: true,  
    required: true
  },
  url: { 
    type: String,
    trim: true, 
    required: true
  },
  description: { 
    type: String,
    trim: true, 
    required: true,
   },
   createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'user', 
    required: [true, "Created by reference is required"],
},
});

module.exports = mongoose.model('Video', video);
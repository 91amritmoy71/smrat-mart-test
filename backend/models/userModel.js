const mongoose = require('mongoose')

const UserModel = new mongoose.Schema({
   name: { type: String, required: true},
   email: { type: String, required: true, unique: true},
   password: { type: String, required: true},
   role: { 
     type: String, 
     enum: ['GENERAL', 'ADMIN'], 
     default: 'GENERAL' 
   },
   isActive: { type: Boolean, default: true },
   lastLogin: { type: Date },
   phone: { type: String },
   address: {
     street: String,
     city: String,
     state: String,
     zipCode: String,
     country: String
   }
}, {
   timestamps: true
});

module.exports = mongoose.model('user', UserModel);

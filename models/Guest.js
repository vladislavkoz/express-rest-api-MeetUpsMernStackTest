const mongoose = require('mongoose')
const GuestSchema = new mongoose.Schema({
  firstName: {type: String },
  lastName: {type: String },
  createdAt: {type: Date, default: Date.now },
    password: {type:String, required: true},
    email: {type: String, required: true}
});

const Guest = mongoose.model('Guest', GuestSchema, 'guests');

module.exports = Guest;
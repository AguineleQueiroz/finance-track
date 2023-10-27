const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required.'],
        minlength: [3, 'Name must be at least 3 characters long.']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required.'],
        validate: {
            validator: function(email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
            },
            message: 'Invalid email address.'
        },
    },
    password: {
        type: String,
        required: [true, 'Password is required.'],
        minlength: [8, 'Password must be at least 8 characters long.']
    }
});
const User = mongoose.model('User', userSchema);

/* Model Functions */

async function findEmail(userEmailObj) {
    return await User.findOne(userEmailObj);
}

async function findUser(userId, keysExceptionsStr) {
    return await User.findById(userId, keysExceptionsStr);
}

module.exports = { User, findEmail, findUser };

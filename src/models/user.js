const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true
    }
});


const cryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}



userSchema.pre('save', async function(next) {
    const user = this;

    if (user.isModified('password')|| user.isNew) {
        user.password = await cryptPassword(user.password);
    }

    next();
})


userSchema.statics.findByCredentials = async function(email, password) {
    const user = await this.findOne({ email });

    if (!user) {
        throw new Error('Invalid login credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Invalid login credentials');
    }

    return user;
};

const Users = mongoose.model('User', userSchema);

module.exports = Users;
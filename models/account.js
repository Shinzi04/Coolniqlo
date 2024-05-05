const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const accountSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        default: '',
    },
    profilePicture: {
        type: String,
        default: '',
    },
});

accountSchema.pre('save', async function(next) {
    // Jika password telah diubah (baru), hash password
    if (this.isModified('password')) {
        try {
            const salt = await bcrypt.genSalt(saltRounds);
            const hashedPassword = await bcrypt.hash(this.password, salt);
            this.password = hashedPassword;
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

module.exports = model("account", accountSchema);
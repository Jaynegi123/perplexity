import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: true
    },

    verified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre("save", async function(next) {

    // If password is not changed don't hash again
    if (!this.isModified("password")) {
        return next();
    }
    // Hash password
    this.password = await bcrypt.hash(this.password, 10);

    next();
});

userSchema.methods.comparePassword = async function(password) {

    return await bcrypt.compare(password, this.password);

};


const User = mongoose.model("User", userSchema);

export default User;
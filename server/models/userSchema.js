import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstname:{
        type: String,
        required: true,
        trim: true,
    },
    lastname:{
        type: String,
        required: true,
        trim: true,
    },
    username:{
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    university:{
        type: String,
        required: true,
        trim: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    profilePicture: {
        type: String,
        default: ''
    },
    password:{
        type: String,
        required: true,
        trim: true,
    },
    branch:{
        type: String,
        default: "",
    },
    course:{
        type: String,
        default: "",
    },
    collageyear:{
        type: String,
        default: "",
    },
    verifyOtp:{
        type: String,
        default: "",
    },
    verifyOtpExpireAt:{
        type: Number,
        default: 0,
    },
    isAccountVerified:{
        type: Boolean,
        default: false,
    },
    resetOtp:{
        type: String,
        default: "",
    },
    resetOtpExpireAt:{
        type: Number,
        default: 0,
    },
});

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;

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
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    // role:{
    //     type: String,
    //     enum: ['admin', 'student', 'teacher'],
    //     default: 'user',
    //     required: true,
    // },
    password:{
        type: String,
        required: true,
        trim: true,
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
 
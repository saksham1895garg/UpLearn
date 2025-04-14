import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    reviews: [{
        from: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        rating: Number,
        comment: String,
        date: {
            type: Date,
            default: Date.now
        }
    }],
    sessions: [{
        sessionId: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: String,
        tutorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        status: {
            type: String,
            enum: ['scheduled', 'active', 'completed', 'cancelled'],
            default: 'scheduled'
        },
        scheduledTime: {
            type: Date,
            required: true
        },
        startTime: Date,
        endTime: Date,
        duration: {
            type: Number,
            default: 0
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            default: 0
        },
        review: {
            type: String,
            default: ''
        }
    }],
    firstname: {
        type: String,
        required: true,
        trim: true,
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    university: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    profilePicture: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    expertise: [{
        subject: String,
        level: String,
        yearsOfExperience: Number
    }],
    availability: [{
        day: String,
        startTime: String,
        endTime: String
    }],
    totalSessions: {
        type: Number,
        default: 0
    },
    averageRating: {
        type: Number,
        default: 0
    },
    branch: {
        type: String,
        default: "",
    },
    course: {
        type: String,
        default: "",
    },
    collageyear: {
        type: String,
        default: "",
    },
    isStudent: {
        type: Boolean,
        default: false,
    },
    isTutor: {
        type: Boolean,
        default: false,
    },
    verifyOtp: {
        type: String,
        default: "",
    },
    verifyOtpExpireAt: {
        type: Number,
        default: 0,
    },
    isAccountVerified: {
        type: Boolean,
        default: false,
    },
    resetOtp: {
        type: String,
        default: "",
    },
    resetOtpExpireAt: {
        type: Number,
        default: 0,
    },
});

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;

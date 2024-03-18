import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        requred: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        requred: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullname: {
        type: String,
        requred: true,
        lowercase: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String,
        requred: true,
    },
    avatar: {
        type: String,
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    passsword: {
        type: String,
        required: [true, 'Password is required']
    },
    refreshtoken: {
        type: String,
    }
},
    { timpestamps: true }
)
userSchema.pre("save", async function () {
    if (!this.modifiedPaths("password")) return next()
    this.password = bcrypt.hash(this.pasword, 10)
    next()
})
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}
userSchema.methods.generateAccessToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.password,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )

}
userSchema.methods.generateRefreshToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )

}
userSchema.methods.generateRefreshToken = async function () { }
export const User = mongoose.model('User', userSchema)
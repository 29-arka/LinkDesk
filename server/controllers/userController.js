import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js"
import generateOtp from "../lib/generateOtp.js";
import sendEmail from  "../lib/sendEmail.js";

//Signup a new user
export const signup = async (req, res)=> {
    const {fullName, email, password, bio} = req.body;
    try {
        if(!fullName || !email || !password|| !bio) {
            return res.json({success: false, message: "Missing Details"})
        }
        const user = await User.findOne({email});
        if(user) {
            return res.json({success: false, message: "Account Already Exists."})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        //generate otp
        const otp = generateOtp()
        const otpExpiry = Date.now() + 10 * 60 * 1000; // valid for 10 min

        const newUser = await User.create({
            fullName, email, password: hashedPassword, bio, otp, otpExpiry, isVerified: false,
        });

        await sendEmail(email, otp);

        res.json({
            success: true,
            message: "OTP sent to your email. Please verify to complete signup.",
        });
        
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }

}

//Verify OTP → activate account
export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (user.isVerified) {
            return res.json({ success: false, message: "Account already verified" });
        }

        if (user.otp !== otp || user.otpExpiry < Date.now()) {
            return res.json({ success: false, message: "Invalid or expired OTP" });
        }

        // OTP is valid → activate user
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        const token = generateToken(user._id);

        res.json({
            success: true,
            message: "Account verified successfully",
            userData: user,
            token
        });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

//Controller to login a user

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userData = await User.findOne({ email });

        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, userData.password);

        if (!isPasswordCorrect) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token = generateToken(userData._id);
        res.json({ success: true, userData, token, message: "Login successful" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// controller to check if user is authenticated
export const checkAuth = (req, res)=>{
    res.json({success: true, user: req.user});
}

//controller to update user profile details
export const updateProfile = async (req, res)=>{
    try {
        const { profilePic, bio, fullName } = req.body;
        const userId = req.user._id;
        let updatedUser;
        if(!profilePic){
           updatedUser = await User.findByIdAndUpdate(userId, {bio, fullName}, {new: true});
        } else {
            const upload = await cloudinary.uploader.upload(profilePic);
            updatedUser = await User.findByIdAndUpdate(userId, {profilePic: upload.secure_url, bio, fullName}, {new: true});
        }
        res.json({success: true, user: updatedUser})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}
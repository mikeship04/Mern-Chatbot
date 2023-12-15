import User from "../models/User.js";
import { hash, compare } from "bcrypt";
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME, COOKIE_PARAMS, LogError } from "../utils/constants.js";
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        return res.status(200).json({ message: "OK", users });
    }
    catch (error) {
        LogError(res, error);
    }
};
export const userSignup = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const exisitingUser = await User.findOne({ email });
        if (exisitingUser)
            return res.status(401).send("User already registered");
        const hashedPassword = await hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        //todo reformat into helper methods
        res.clearCookie(COOKIE_NAME, COOKIE_PARAMS);
        const token = createToken(user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(COOKIE_NAME, token, { ...COOKIE_PARAMS,
            expires
        });
        return res.status(201).json({ message: "OK", name: user.name, email: user.email });
    }
    catch (error) {
        LogError(res, error);
    }
};
export const userLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user)
            return res.status(401).send("User not registered");
        const isPasswordCorrect = await compare(password, user.password);
        if (!isPasswordCorrect)
            res.status(403).send("incorrect Password");
        res.clearCookie(COOKIE_NAME, COOKIE_PARAMS);
        const token = createToken(user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(COOKIE_NAME, token, { ...COOKIE_PARAMS,
            expires
        });
        res.status(200).json({ message: "OK", name: user.name, email: user.email });
    }
    catch (error) {
        LogError(res, error);
    }
};
export const verifyUser = async (req, res, next) => {
    try {
        const user = await User.findById(res.locals.jwtData.id);
        console.log(user);
        if (!user)
            return res.status(401).send('User not registered');
        if (user._id.toString() !== res.locals.jwtData.id)
            return res.status(401).send('permissions did not match');
        return res.status(200).json({ message: 'OK', name: user.name, email: user.email });
    }
    catch (error) {
        LogError(res, error);
    }
};
//# sourceMappingURL=user-controller.js.map
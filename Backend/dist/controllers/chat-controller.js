import User from "../models/User.js";
import { configureOpenAI } from "../config/openai-config.js";
import { OpenAIApi } from "openai";
import { LogError } from "../utils/constants.js";
export const generateChatCompletion = async (req, res, next) => {
    try {
        const { message } = req.body;
        const user = await User.findById(res.locals.jwtData.id);
        //todo refactor messages into constants for reusability
        if (!user)
            return res.status(401).json({ message: "User not registered" });
        const chats = user.chats.map(({ role, content }) => ({ role, content }));
        chats.push({ content: message, role: 'user' });
        user.chats.push({ content: message, role: 'user' });
        const config = configureOpenAI();
        const openai = new OpenAIApi(config);
        const chatResponse = await openai.createChatCompletion({ model: "gpt-3.5-turbo", messages: chats });
        user.chats.push(chatResponse.data.choices[0].message);
        await user.save();
        return res.status(200).json({ chats: user.chats });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
};
export const sendChatsToUser = async (req, res, next) => {
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user)
            return res.status(401).send('User not registered');
        if (user._id.toString() !== res.locals.jwtData.id)
            return res.status(401).send('permissions did not match');
        return res.status(200).json({ message: 'OK', chats: user.chats });
    }
    catch (error) {
        LogError(res, error);
    }
};
export const deleteUserChats = async (req, res, next) => {
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user)
            return res.status(401).send('User not registered');
        if (user._id.toString() !== res.locals.jwtData.id)
            return res.status(401).send('permissions did not match');
        //@ts-ignore
        user.chats = [];
        await user.save();
        return res.status(200).json({ message: 'OK' });
    }
    catch (error) {
        LogError(res, error);
    }
};
//# sourceMappingURL=chat-controller.js.map
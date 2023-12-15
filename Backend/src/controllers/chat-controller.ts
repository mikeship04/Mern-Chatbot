import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import { configureOpenAI } from "../config/openai-config.js";
import { OpenAIApi, ChatCompletionRequestMessage } from "openai";

export const generateChatCompletion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { message } = req.body
    const user = await User.findById(res.locals.jwtData.id)
    //todo refactor messages into constants for reusability
    if (!user) return res.status(401).json({ message: "User not registered" })
    //get all user chats
    //send all chats with new one (to keep context)
    // get latest response
    const chats = user.chats.map(({ role, content }) => ({ role, content })) as ChatCompletionRequestMessage[]
    chats.push({ content: message, role: 'user' })
    user.chats.push({ content: message, role: 'user' })

    const config = configureOpenAI()
    const openai = new OpenAIApi(config)

    const chatResponse = await openai.createChatCompletion({ model: "gpt-3.5-turbo", messages: chats })

    user.chats.push(chatResponse.data.choices[0].message)
    await user.save()
    return res.status(200).json({chats: user.chats})
  } catch (error) {
    console.log(error)
    return res.status(500).json({message: 'Something went wrong'})
  }
}
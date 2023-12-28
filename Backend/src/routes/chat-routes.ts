import { Router } from "express";
import { verifyToken } from "../utils/token-manager.js";
import { chatCompletioinValidator, validator } from "../utils/validators.js";
import { generateChatCompletion, sendChatsToUser, deleteUserChats } from "../controllers/chat-controller.js";

//protected API
const chatRoutes = Router()

chatRoutes.post(
  '/new', 
  validator(chatCompletioinValidator), 
  verifyToken, 
  generateChatCompletion
)

chatRoutes.get(
  '/all-chats',
  verifyToken,
  sendChatsToUser
)

chatRoutes.delete(
  '/delete',
  verifyToken,
  deleteUserChats
)

export default chatRoutes
import { Router } from "express";
import { verifyToken } from "../utils/token-manager.js";
import { chatCompletioinValidator, validator } from "../utils/validators.js";
import { generateChatCompletion } from "../controllers/chat-controller.js";

//protected API
const chatRoutes = Router()

chatRoutes.post(
  '/new', 
  validator(chatCompletioinValidator), 
  verifyToken, 
  generateChatCompletion
)

export default chatRoutes
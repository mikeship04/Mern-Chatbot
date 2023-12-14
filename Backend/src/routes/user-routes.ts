import { Router } from "express"
import { getAllUsers, userLogin, userSignup, verifyUser } from "../controllers/user-controller.js"
import { validator, signupValidator, loginValidator } from "../utils/validators.js"
import { verifyToken } from "../utils/token-manager.js"

const userRoutes = Router()

userRoutes.get('/', getAllUsers)
userRoutes.post('/signup', validator(signupValidator), userSignup)
userRoutes.post('/login', validator(loginValidator), userLogin)
userRoutes.get('/auth-status', verifyToken, verifyUser)

export default userRoutes
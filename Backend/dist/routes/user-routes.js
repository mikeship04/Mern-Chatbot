import { Router } from "express";
import { getAllUsers, userLogin, userSignup } from "../controllers/user-controller.js";
import { validator, signupValidator, loginValidator } from "../utils/validators.js";
const userRoutes = Router();
userRoutes.get('/', getAllUsers);
userRoutes.post('/signup', validator(signupValidator), userSignup);
userRoutes.post('/login', validator(loginValidator), userLogin);
export default userRoutes;
//# sourceMappingURL=user-routes.js.map
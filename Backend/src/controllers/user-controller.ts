import { NextFunction, Request, Response } from "express"
import User from "../models/User.js"
import { hash, compare } from "bcrypt"
import { createToken } from "../utils/token-manager.js"
import { COOKIE_NAME, COOKIE_PARAMS } from "../utils/constants.js"

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find()
    return res.status(200).json({ message: "OK", users })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ message: "ERROR", cause: error.message })

  }
}

export const userSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body
    const exisitingUser = await User.findOne({ email })
    if (exisitingUser) return res.status(401).send("User already registered")
    const hashedPassword = await hash(password, 10)
    const user = new User({ name, email, password: hashedPassword })
    await user.save()
    //todo reformat into helper methods
    res.clearCookie(COOKIE_NAME, COOKIE_PARAMS)

    const token = createToken(user._id.toString(), user.email, "7d")
    const expires = new Date()
    expires.setDate(expires.getDate() + 7)
    
    res.cookie(COOKIE_NAME, token, 
      { ...COOKIE_PARAMS,
        expires
      }
    )

    return res.status(201).json({ message: "OK", id: user._id.toString() })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ message: "ERROR", cause: error.message })
  }
}

export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(401).send("User not registered")
    const isPasswordCorrect = await compare(password, user.password)
    if (!isPasswordCorrect)
      res.status(403).send("incorrect Password")

    res.clearCookie(COOKIE_NAME, COOKIE_PARAMS)

    const token = createToken(user._id.toString(), user.email, "7d")
    const expires = new Date()
    expires.setDate(expires.getDate() + 7)

    res.cookie(COOKIE_NAME, token, 
      { ...COOKIE_PARAMS,
        expires
      }
    )
    res.status(200).json({ message: "OK", id: user._id.toString() })

  } catch (error) {
    console.log(error)
    return res.status(400).json({ message: "ERROR", cause: error.message })
  }
}
import { UserController } from "../controllers/userControllers";
import { Router } from "express";
import { createUserSchema, deleteUserSchema, getUserByIdSchema, updateUserSchema, loginUserSchema } from "../schemas/userSchemas";
import { validate } from "../middlewares/validateMiddleware";
import { authMiddleware } from "../middlewares/authMiddleware";
const router = Router()

router.post("/create-user", validate(createUserSchema), UserController.createUser)

router.get("/users", authMiddleware, UserController.getAllUsers)

router.get("/users/:id", authMiddleware, validate(getUserByIdSchema), UserController.getUserById)

router.put("/update-user/:id", authMiddleware, validate(updateUserSchema), UserController.updateUser)

router.delete("/delete-user/:id", authMiddleware, validate(deleteUserSchema), UserController.deleteUser)

router.post("/login-user", validate(loginUserSchema), UserController.loginUser)

export default router
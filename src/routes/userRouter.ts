import { UserController } from "../controllers/userControllers";
import { Router } from "express";
import { createUserSchema, deleteUserSchema, getUserByIdSchema, updateUserSchema, loginUserSchema } from "../schemas/userSchemas";
import { validate } from "../middlewares/validateMiddleware";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router()

router.use(authMiddleware)

router.post("/create-user", validate(createUserSchema), UserController.createUser)

router.get("/users", UserController.getAllUsers)

router.get("/users/:id", validate(getUserByIdSchema), UserController.getUserById)

router.put("/update-user/:id", validate(updateUserSchema), UserController.updateUser)

router.delete("/delete-user/:id", validate(deleteUserSchema), UserController.deleteUser)

router.post("/login-user", validate(loginUserSchema), UserController.loginUser)

export default router
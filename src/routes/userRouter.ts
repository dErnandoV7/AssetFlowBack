import { UserController } from "../controllers/userControllers";
import { Router } from "express";
import { createUserSchema, deleteUserSchema, getUserByIdSchema, updateUserSchema } from "../schemas/UserSchemas";
import { validate } from "../middlewares/validateMiddleware";
const router = Router()

router.post("/create-user", validate(createUserSchema), UserController.createUser)

router.get("/users", UserController.getAllUsers)

router.get("/users/:id", validate(getUserByIdSchema), UserController.getUserById)

router.put("/update-user/:id", validate(updateUserSchema), UserController.updateUser)

router.delete("/delete-user/:id", validate(deleteUserSchema), UserController.deleteUser)

export default router
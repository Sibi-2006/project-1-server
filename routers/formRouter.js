import express from "express";
import { getAllUser, postNewUser, SignInUser , EditUser } from "../controller/formController.js";

const router = express.Router();

router.get("/", getAllUser);
router.post("/", postNewUser);
router.post("/signin", SignInUser);
router.patch('/:id', EditUser )
export default router;

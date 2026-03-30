import express from "express";
import { auth } from "../middlewares/auth.js";
import { uploadPetImage } from "../middlewares/upload.js";
import { validate } from "../middlewares/validate.js";
import { userUpdateSchema } from "../validators/userValidator.js";
import * as petController from "../controllers/petController.js";
import * as userController from "../controllers/userController.js";

const router = express.Router();

router.get("/me", auth, userController.getMe);
router.put("/me", auth, validate(userUpdateSchema), userController.updateMe);

router.post("/pets", auth, petController.createPet);
router.get("/pets", auth, petController.getPets);
router.post("/pets/upload", auth, uploadPetImage.single("foto"), petController.uploadPetPhoto);
router.get("/pets/:id", auth, petController.getPetById);
router.put("/pets/:id", auth, petController.updatePet);
router.delete("/pets/:id", auth, petController.deletePet);

export default router;

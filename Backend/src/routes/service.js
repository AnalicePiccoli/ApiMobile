import express from "express";
import { auth, isAdmin } from "../middlewares/auth.js";
import * as serviceController from "../controllers/serviceController.js";

const router = express.Router();

router.get("/", serviceController.listServices);
router.post("/", auth, isAdmin, serviceController.createService);
router.put("/:id", auth, isAdmin, serviceController.updateService);
router.delete("/:id", auth, isAdmin, serviceController.deleteService);

export default router;

import express from "express";
import { auth } from "../middlewares/auth.js";
import * as appointmentController from "../controllers/appointmentController.js";

const router = express.Router();

router.get("/", auth, appointmentController.listAppointments);
router.post("/", auth, appointmentController.createAppointment);

export default router;

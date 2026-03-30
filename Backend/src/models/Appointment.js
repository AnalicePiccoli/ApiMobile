import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    pet: { type: mongoose.Schema.Types.ObjectId, ref: "Pet" },
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
    date: Date
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);

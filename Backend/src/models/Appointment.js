import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pet",
      required: true
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    observacao: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ["agendado", "concluido", "cancelado"],
      default: "agendado"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);

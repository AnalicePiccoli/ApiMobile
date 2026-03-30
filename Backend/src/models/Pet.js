import mongoose from "mongoose";

const petSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, trim: true },
    idade: { type: Number, min: 0 },
    raca: { type: String, trim: true },
    peso: { type: Number, min: 0 },
    porte: { type: String, trim: true },
    alergias: { type: String, trim: true },
    fotoUrl: { type: String, trim: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Pet", petSchema);

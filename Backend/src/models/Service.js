import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, trim: true },
    descricao: { type: String, trim: true },
    tempoEstimadoMin: { type: Number, min: 0 },
    preco: { type: Number, min: 0, required: true },
    ativo: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Service", serviceSchema);

import Service from "../models/Service.js";

const initialServices = [
  {
    nome: "Banho",
    descricao: "Deixe seu pet cheiroso",
    tempoEstimadoMin: 60,
    preco: 60
  },
  {
    nome: "Banho e tosa",
    descricao: "Banho completo com tosa",
    tempoEstimadoMin: 90,
    preco: 95
  },
  {
    nome: "Vacinas",
    descricao: "Aplicacao de vacinas recomendadas",
    tempoEstimadoMin: 30,
    preco: 120
  }
];

export async function seedServices() {
  const count = await Service.countDocuments();

  if (count === 0) {
    await Service.insertMany(initialServices);
  }
}

import Appointment from "../models/Appointment.js";
import Pet from "../models/Pet.js";
import Service from "../models/Service.js";

export async function createAppointment(req, res, next) {
  try {
    const { petId, serviceId, date, observacao } = req.body;

    if (!petId || !serviceId || !date) {
      return res.status(400).json({ error: "petId, serviceId e date sao obrigatorios" });
    }

    const pet = await Pet.findOne({ _id: petId, owner: req.user.id });
    if (!pet) {
      return res.status(404).json({ error: "Pet nao encontrado" });
    }

    const service = await Service.findOne({ _id: serviceId, ativo: true });
    if (!service) {
      return res.status(404).json({ error: "Servico nao encontrado" });
    }

    const appointment = await Appointment.create({
      owner: req.user.id,
      pet: pet._id,
      service: service._id,
      date,
      observacao
    });

    const populated = await Appointment.findById(appointment._id)
      .populate("pet")
      .populate("service");

    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
}

export async function listAppointments(req, res, next) {
  try {
    const appointments = await Appointment.find({ owner: req.user.id })
      .populate("pet")
      .populate("service")
      .sort({ date: -1, createdAt: -1 });

    res.json(appointments);
  } catch (err) {
    next(err);
  }
}

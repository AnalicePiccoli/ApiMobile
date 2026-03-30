import Service from "../models/Service.js";

export async function listServices(req, res, next) {
  try {
    const { q } = req.query;
    const filters = { ativo: true };

    if (q) {
      filters.$or = [
        { nome: { $regex: q, $options: "i" } },
        { descricao: { $regex: q, $options: "i" } }
      ];
    }

    const services = await Service.find(filters).sort({ nome: 1 });
    res.json(services);
  } catch (err) {
    next(err);
  }
}

export async function createService(req, res, next) {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (err) {
    next(err);
  }
}

export async function updateService(req, res, next) {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!service) {
      return res.status(404).json({ error: "Servico nao encontrado" });
    }

    res.json(service);
  } catch (err) {
    next(err);
  }
}

export async function deleteService(req, res, next) {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({ error: "Servico nao encontrado" });
    }

    res.json({ message: "Servico removido" });
  } catch (err) {
    next(err);
  }
}

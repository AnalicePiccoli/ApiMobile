import Pet from "../models/Pet.js";

function normalizePetPayload(body) {
  return {
    nome: body.nome || body.name,
    idade: body.idade ?? body.age,
    raca: body.raca || body.breed,
    peso: body.peso,
    porte: body.porte,
    alergias: body.alergias,
    fotoUrl: body.fotoUrl
  };
}

export async function createPet(req, res, next) {
  try {
    const payload = normalizePetPayload(req.body);
    const pet = await Pet.create({ ...payload, owner: req.user.id });
    res.status(201).json(pet);
  } catch (err) {
    next(err);
  }
}

export async function getPets(req, res, next) {
  try {
    const pets = await Pet.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.json(pets);
  } catch (err) {
    next(err);
  }
}

export async function getPetById(req, res, next) {
  try {
    const pet = await Pet.findOne({ _id: req.params.id, owner: req.user.id });

    if (!pet) {
      return res.status(404).json({ error: "Pet nao encontrado" });
    }

    res.json(pet);
  } catch (err) {
    next(err);
  }
}

export async function updatePet(req, res, next) {
  try {
    const payload = normalizePetPayload(req.body);
    const pet = await Pet.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      payload,
      { new: true, runValidators: true }
    );

    if (!pet) {
      return res.status(404).json({ error: "Pet nao encontrado" });
    }

    res.json(pet);
  } catch (err) {
    next(err);
  }
}

export async function deletePet(req, res, next) {
  try {
    const deleted = await Pet.findOneAndDelete({ _id: req.params.id, owner: req.user.id });

    if (!deleted) {
      return res.status(404).json({ error: "Pet nao encontrado" });
    }

    res.json({ message: "Pet deletado" });
  } catch (err) {
    next(err);
  }
}

export async function uploadPetPhoto(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Arquivo de imagem nao enviado" });
    }

    const fotoUrl = `${req.protocol}://${req.get("host")}/uploads/pets/${req.file.filename}`;
    res.status(201).json({
      fotoUrl,
      arquivo: req.file.filename
    });
  } catch (err) {
    next(err);
  }
}

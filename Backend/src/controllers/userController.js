import User from "../models/User.js";

export async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "Usuario nao encontrado" });
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function updateMe(req, res, next) {
  try {
    const { nome, cpf, email, telefone, endereco } = req.body;

    if (email || cpf) {
      const existing = await User.findOne({
        _id: { $ne: req.user.id },
        $or: [email ? { email } : null, cpf ? { cpf } : null].filter(Boolean)
      });

      if (existing) {
        return res.status(409).json({ error: "Email ou CPF ja em uso" });
      }
    }

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { nome, cpf, email, telefone, endereco },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updated) {
      return res.status(404).json({ error: "Usuario nao encontrado" });
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
}

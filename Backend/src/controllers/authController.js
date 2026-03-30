import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";

function signToken(user) {
  return jwt.sign(
    { id: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
}

function serializeUser(user) {
  return {
    id: user._id,
    nome: user.nome,
    cpf: user.cpf,
    email: user.email,
    telefone: user.telefone,
    endereco: user.endereco,
    role: user.role
  };
}

export async function register(req, res, next) {
  try {
    const { nome, name, cpf, email, password, telefone, endereco, role } = req.body;
    const nomeFinal = (nome || name || "").trim();
    if (!password) return res.status(400).json({ error: "Password obrigatorio" });

    const existingUser = await User.findOne({
      $or: [{ email }, { cpf }]
    });

    if (existingUser) {
      return res.status(409).json({ error: "Email ou CPF ja cadastrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      nome: nomeFinal,
      cpf,
      email,
      password: hashedPassword,
      telefone,
      endereco,
      role: role || "user"
    });

    const token = signToken(user);
    res.status(201).json({ token, user: serializeUser(user) });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!password) return res.status(400).json({ error: "Password obrigatorio" });

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Credenciais invalidas" });
    }

    if (!user.password) {
      return res.status(500).json({ error: "Usuario sem senha cadastrada" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Credenciais invalidas" });
    }

    const token = signToken(user);
    res.json({ token, user: serializeUser(user) });
  } catch (err) {
    next(err);
  }
}

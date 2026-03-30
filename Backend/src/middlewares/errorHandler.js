export default function errorHandler(err, req, res, next) {
  console.error(`[ERROR] ${err.name}: ${err.message}`);

  if (err.name === "CastError" && err.kind === "ObjectId") {
    return res.status(400).json({ error: "Recurso nao encontrado: ID invalido." });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ error: `Este ${field} ja esta em uso.` });
  }

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({ error: `Dados invalidos: ${messages.join(", ")}` });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "Token de acesso invalido ou malformado." });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ error: "Sua sessao expirou. Faca login novamente." });
  }

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "JSON malformado no corpo da requisicao." });
  }

  if (err.status === 403) {
    return res.status(403).json({ error: "Voce nao tem permissao para acessar este recurso." });
  }

  return res.status(err.status || 500).json({
    error: err.message || "Erro interno do servidor."
  });
}

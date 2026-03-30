// validação de dados usando um schema genérico do joi
export const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false }); // para pegar todos os erros

  if (error) {
    const messages = error.details.map(d => d.message);
    return res.status(400).json({ errors: messages }); //se a resposta do JSON for 400, retorna a mensagem
  } //com os detalhes do erro na mensagem

  // Importante: Substituímos o body pelo valor sanitizado (com trim, lowercase, etc)
  req.body = value;
  next();
};

export const schemaValidator = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    // Verificamos que sea un ZodError
    if (error.name === "ZodError") {
      const errorMessage = error.issues.map((err) => err.message).join(', ');
      return res.status(400).json({ message: errorMessage });
    }
    // Otros errores inesperados
    return res.status(500).json({ message: error.message });
  }
};

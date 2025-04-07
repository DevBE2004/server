const validateInfo = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    const message = error.details[0].message?.replaceAll(`\"`, "");
    throw new Error(message);
  }
  next();
};

module.exports = validateInfo;

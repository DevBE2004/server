const validateInfo = (schema) => (req, res, next) => {
  const dataToValidate = {
    ...req.body,
    ...(req.file && { profilePic: req.file }),
  };
  const { error } = schema.validate(dataToValidate);
  if (error) {
    const message = error.details[0].message?.replaceAll(`\"`, "");
    throw new Error(message);
  }
  next();
};

module.exports = validateInfo;

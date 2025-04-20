const validateInfo = (schema) => (req, res, next) => {
  let fileData = {};

  if (req.file) fileData = { [req.file.fieldname]: req.file };

  if (req.files)
    Object.entries(req.files).forEach(([fieldname, files]) => {
      fileData[fieldname] = files.length === 1 ? files[0] : files;
    });

  const dataToValidate = {
    ...req.body,
    ...fileData,
  };
  const { error } = schema.validate(dataToValidate);
  if (error) {
    const message = error.details[0].message?.replaceAll(`\"`, "");
    throw new Error(message);
  }
  next();
};

module.exports = validateInfo;

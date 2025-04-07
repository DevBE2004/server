const Joi = require("joi");

const string = Joi.string().allow(null, "");
const stringReq = Joi.string().required();
const number = Joi.number().allow(null, "");
const numberReq = Joi.number().required();
const array = Joi.array().allow(null, "");
const arrayReq = Joi.array().required();
const email = Joi.string().email().required();
const boolean = Joi.boolean();
const phone = Joi.string()
  .pattern(/^\d{10,}$/)
  .required();

const products = Joi.array()
  .items(
    Joi.object({
      product: stringReq,
      quantity: numberReq,
    })
  )
  .required();

const product = Joi.object({
  product: stringReq,
  quantity: numberReq,
}).required();

const category = Joi.array()
  .items(
    Joi.string().required().messages({
      "string.empty": "Mục category không được để trống",
      "any.required": "Yêu cầu có mục category",
    })
  )
  .min(1)
  .required()
  .messages({
    "array.min": "Cần ít nhất một category",
    "any.required": "Danh sách category là bắt buộc",
  });

const file = Joi.object({
  fieldname: Joi.string().required(),
  originalname: Joi.string().required(),
  encoding: Joi.string().required(),
  mimetype: Joi.string().required(),
  path: Joi.string().required(),
  size: Joi.number().max(5 * 1024 * 1024),
  filename: Joi.string().required(),
}).required();

const files = Joi.array().items(file).required();

module.exports = {
  string,
  stringReq,
  number,
  numberReq,
  array,
  arrayReq,
  email,
  phone,
  boolean,
  products,
  product,
  category,
  file,
  files,
};

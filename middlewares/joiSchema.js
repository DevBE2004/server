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
const profilePicFile = Joi.object({
  fieldname: Joi.string().required(),
  originalname: Joi.string().required(),
  encoding: Joi.string().required(),
  mimetype: Joi.string()
    .valid("image/jpeg", "image/png", "image/gif", "image/jpg")
    .required(),
  size: Joi.number().max(5 * 1024 * 1024), // 5MB
});

const productPicSchema = Joi.object({
  productPics: Joi.array().items(profilePicFile).min(1).required().messages({
    "array.empty": "Ít nhất một ảnh sản phẩm là bắt buộc",
    "any.required": "Trường productPics là bắt buộc",
  }),
});

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
module.exports = {
  string,
  stringReq,
  number,
  numberReq,
  array,
  arrayReq,
  email,
  phone,
  profilePicFile,
  boolean,
  productPicSchema,
  products,
  product,
};

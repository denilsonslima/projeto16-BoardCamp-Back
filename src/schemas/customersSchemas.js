import joi from "joi"

export const Schema = joi.object({
    name: joi.string().required,
    phone: joi.string().min(10).max(11).required(),
    cpf: joi.string().pattern(/^\d+$/).required(),
    birthday: joi.string().pattern(/^\d{4}\-\d{2}\-\d{2}$/).required()
})
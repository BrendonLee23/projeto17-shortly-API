import joi from 'joi';

const signUpSchema = joi.object({

    name: joi.string().min(3).required(),
    email: joi.string().email().required(),
    password: joi.string().min(5).required(),
    confirmPassword: joi.string().min(5).required()

});

export default signUpSchema;
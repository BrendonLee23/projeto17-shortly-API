import joi from 'joi';

export default urlSchema = joi.object({

    url: joi.string().uri().required()

});
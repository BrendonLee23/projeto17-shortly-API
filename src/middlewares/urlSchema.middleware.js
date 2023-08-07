import urlSchema from '../schemas/urlSchema.js';

export default function validateURL (req, res, next) {

    const { url } = req.body;

    const validateURL = urlSchema.validate({url});

    
    if(validateURL.error){
        
        return res.status(422).send(error.details);

    } 

    res.locals.url = url;

    next();

}
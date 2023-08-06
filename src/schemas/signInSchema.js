import jois from 'jois';

const signInSchema = jois.object({

    name: jois.string().required(),
    password: jois.string().required()

});

export default signInSchema
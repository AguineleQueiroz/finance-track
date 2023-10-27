const { request, response } = require('express');
const { User, findEmail } = require('../models/User');
const { bcrypt, jwt } = require('../Utils/util');

async function verifyPasswordUserIsCorrect(password, pswd_user_db) {
    return await bcrypt.compare(password, pswd_user_db);
}

const signin = async (request, response) => {
    const { email, password } = request.body;
    if(!email) return response.status(422).json({ msg: 'Email is required.'})
    if(!password) return response.status(422).json({ msg: 'Password is required.'})
    try {        
        const user = await findEmail({ email:email });
        if(!user) return response.status(404).json({ msg: 'User not found'});
        const isCorrect = await verifyPasswordUserIsCorrect(password, user.password);
        if(!isCorrect) {
            return response.status(401).json({ msg: 'Inválid password.'})
        }

        try {
            const secret = process.env.SECRET;
            const token = jwt.sign( 
                { id: user._id }, 
                secret 
            )
            response.status(200).json({ msg: "User logged.", token })
        } catch (error) {
            
        }
    } catch (error) {
        console.log(error);
    }
}
module.exports = { signin }
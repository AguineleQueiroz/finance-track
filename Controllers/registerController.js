const { User } = require('../models/User');
const { bcrypt } = require('../Utils/util');

async function createUser(draftUser) {
    const salt = await bcrypt.genSalt(12);  
    const pswdHash = await bcrypt.hash(draftUser.password, salt);

    const user = new User({
        name: draftUser.name,
        email: draftUser.email,
        password: draftUser.password
    });
    await user.validate();    
    user.password = pswdHash;
    return true;
}

const register = async ( request, response ) => {
    const { name, email, password, confirm_password } = request.body;
    try {
        const existEmail = await User.findOne({email:email});
        if(existEmail) return response.status(422).json({ msg: "Email is already in use."})

        if( password !== confirm_password ) return response.status(422).json({ msg: "Passwords doesnt match."});
        
        await createUser({ name, email, password }); 
        return response.status(200).json({ msg: "User registered successfully."}) 

    } catch(error) {
        const errors = [];
        if(error.errors) {
            for (const key in error.errors) {
                if (Object.hasOwnProperty.call(error.errors, key)) {
                    errors.push(error.errors[key].message)                    
                }
            }
        }else {
            errors.push(error.message);
        }
        response.status(422).json({ 
            msg: { errors }
        });
    }
}
module.exports = { register }
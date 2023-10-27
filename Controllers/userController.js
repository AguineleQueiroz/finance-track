const { findUser } = require('../models/User')

const getUser = async(request, response) => {
    const userId = request.params.id;
    const user = await findUser(userId, '-password');
    if(!user) return response.status(404).json({ msg: 'User not found'});
    response.status(200).json({ user });
}
module.exports = { getUser }
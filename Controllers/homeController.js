const home = (request, response) => {
    response.status(200).json({
        msg: 'Welcome to Finance Track Application.'
    });
}

module.exports = { home }
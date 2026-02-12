const jsonwebtoken = require("jsonwebtoken");

const generateToken = (data) => {
    const token = jsonwebtoken.sign(data, process.env.JWT_SECRET);
    return token;
};

module.exports = { generateToken };
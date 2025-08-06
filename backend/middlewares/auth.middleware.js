var jwt = require('jsonwebtoken');
const redisClient = require("../services/redis.service")



const authUser = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).send({ error: 'Unauthorized user' });
        }
        
const isBlackListed = await redisClient.get(token)

    if (isBlackListed ) {

        res.cookie('token', '')

            return res.status(401).send({ error: 'Unauthorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
        
    } catch (error) {
        console.log(error)
        return res.status(401).send({ error: 'Unauthorized user' });
    }
}

module.exports = { authUser };
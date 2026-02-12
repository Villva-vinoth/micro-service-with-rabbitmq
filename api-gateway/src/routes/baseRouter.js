const router = require("express").Router();

router.get('/', (req, res) => res.send("API Gateway"));
router.use('/admin', require('./adminRouter'));
router.use('/auth', require('./authRouter'));


module.exports = router
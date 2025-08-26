var express = require('express');
var router = express.Router();
const aiController = require('../controllers/ai.controller');

router.get('/get-result',aiController.getResult);


module.exports = router;
const express = require("express");

const {sendContactMessage} = require("../controller/contactController");

const router = express.Router();

router.post("/send", sendContactMessage);

module.exports = router;
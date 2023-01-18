const express = require("express");

const { tryCatchWrapper, auth } = require("../../middlewares");
const { getCurrent } = require("../../controllers");

const router = express.Router();

router.get("/current", auth, tryCatchWrapper(getCurrent));

module.exports = router;

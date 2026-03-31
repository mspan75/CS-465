const express = require("express");
const router = express.Router();
const tripsController = require("../controllers/trips");

//Define route for trips endpoint
router.route("/trips").get(tripsController.tripsList);

// GET Method routes for tripCode
router.route("/trips/:tripCode").get(tripsController.tripsFindByCode);

module.exports = router;

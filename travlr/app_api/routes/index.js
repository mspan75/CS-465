const express = require("express");
const router = express.Router();
const tripsController = require("../controllers/trips");

// Define route for trips endpoint
router
  .route("/trips")
  .get(tripsController.tripsList)
  .post(tripsController.tripsAddTrip);

// GET and PUT Method routes for tripCode
router
  .route("/trips/:tripCode")
  .get(tripsController.tripsFindByCode)
  .put(tripsController.tripsUpdateTrip);
  .delete(tripsController.tripsDeleteTrip);

module.exports = router;

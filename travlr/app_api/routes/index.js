const express = require("express");
const router = express.Router();
const tripsController = require("../controllers/trips");
const authController = require("../controllers/authentication");
const jwt = require("jsonwebtoken");

// Method to authenticate our JWT
function authenticateJWT(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (authHeader == null) {
    console.log("Auth Header Required but NOT PRESENT!");
    return res.sendStatus(401);
  }
  let headers = authHeader.split(" ");
  if (headers.length < 1) {
    console.log("Not enough tokens in Auth Header: " + headers.length);
    return res.sendStatus(501);
  }
  const token = authHeader.split(" ")[1];
  if (token == null) {
    console.log("Null Bearer Token");
    return res.sendStatus(401);
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, verified) => {
    if (err) {
      return res.sendStatus(401);
    }
    req.auth = verified;
  });
  next();
}

// define route for registration endpoint
router.route("/register").post(authController.register);

// define route for login endpoint
router.route("/login").post(authController.login);

// Define route for trips endpoint
router
  .route("/trips")
  .get(tripsController.tripsList)
  .post(authenticateJWT, tripsController.tripsAddTrip);

// GET and PUT Method routes for tripCode
router
  .route("/trips/:tripCode")
  .get(tripsController.tripsFindByCode)
  .put(authenticateJWT, tripsController.tripsUpdateTrip)
  .delete(tripsController.tripsDeleteTrip);

module.exports = router;

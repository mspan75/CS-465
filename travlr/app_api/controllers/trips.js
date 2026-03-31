const mongoose = require("mongoose");
const Trip = require("../models/travlr");
const Model = mongoose.model("trips");

// GET: /trips -list all the trips
// regardless of outcome, response to include HTML status code
// and JSON message to requesting client
const tripsList = async (req, res) => {
  const q = await Model.find({}) // NO FILTER, returns ALL records
    .exec();

  // Uncomment the following line to show results of query on the console
  // console.log(q);

  if (!q) {
    //Database returns no data
    return res.status(404).json({ message: "trips not found" });
  } else {
    return res // Return resulting trip list
      .status(200)
      .json(q);
  }
};

// GET: /trips/:tripCode - returns a single trip
const tripsFindByCode = async (req, res) => {
  const q = await Model.find({ code: req.params.tripCode }) // Filter by tripCode parameter
    .exec();

  // Uncomment the following line to show results of query
  // console.log(q);

  if (!q || q.length === 0) {
    // Database returned no data
    return res.status(404).json({ message: "trip not found" });
  } else {
    // Return single trip
    return res.status(200).json(q);
  }
};

module.exports = {
  tripsList,
  tripsFindByCode,
};

const mongoose = require("mongoose");
const Trip = require("../models/travlr");
const Model = mongoose.model("trips");

// GET: /trips - list all the trips
// regardless of outcome, response to include HTML status code
// and JSON message to requesting client
const tripsList = async (req, res) => {
  const q = await Model.find({}) // NO FILTER, returns ALL records
    .exec();

  // Uncomment the following line to show results of query on the console
  // console.log(q);

  if (!q) {
    // Database returns no data
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

// POST: /trips - add a new trip
const tripsAddTrip = async (req, res) => {
  const newTrip = new Model({
    code: req.body.code,
    name: req.body.name,
    length: req.body.length,
    start: req.body.start,
    resort: req.body.resort,
    perPerson: req.body.perPerson,
    image: req.body.image,
    description: req.body.description,
  });

  const q = await newTrip.save();

  if (!q) {
    return res.status(400).json({ message: "Failed to add trip" });
  } else {
    return res.status(201).json(q);
  }
};

// PUT: /trips/:tripCode - update a trip
const tripsUpdateTrip = async (req, res) => {
  const q = await Model.findOneAndUpdate(
    { code: req.params.tripCode },
    {
      code: req.body.code,
      name: req.body.name,
      length: req.body.length,
      start: req.body.start,
      resort: req.body.resort,
      perPerson: req.body.perPerson,
      image: req.body.image,
      description: req.body.description,
    },
    { new: true },
  ).exec();

  if (!q) {
    return res.status(404).json({ message: "Trip not found" });
  } else {
    return res.status(200).json(q);
  }
};

// DELETE: /trips/:tripCode - delete a trip
const tripsDeleteTrip = async (req, res) => {
  const q = await Model.findOneAndDelete({ code: req.params.tripCode }).exec();

  if (!q) {
    return res.status(404).json({ message: "Trip not found" });
  } else {
    return res.status(200).json({ message: "Trip deleted successfully" });
  }
};

module.exports = {
  tripsList,
  tripsFindByCode,
  tripsAddTrip,
  tripsUpdateTrip,
  tripsDeleteTrip,
};

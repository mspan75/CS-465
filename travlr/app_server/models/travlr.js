const mongoose = require("mongoose"); //We need Mongoose to create schemas

// Define the trip schema with 8 fields: code, name, length, start, resort, perPerson, image, description
const tripSchema = new mongoose.Schema({
  code: { type: String, required: true, index: true },
  name: { type: String, required: true, index: true },
  length: { type: String, required: true },
  start: { type: Date, required: true },
  resort: { type: String, required: true },
  perPerson: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
});

// Compile the schema into a model
const Trip = mongoose.model("Trip", tripSchema);

// Export the model
module.exports = Trip;

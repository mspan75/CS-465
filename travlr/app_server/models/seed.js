// Bring in the database connection
require("./db");

// Bring in the Trip model
const Trip = require("./travlr");

// Read seed data from JSON file
const fs = require("fs");
const trips = JSON.parse(fs.readFileSync("./data/trips.json", "utf8"));

// Seed the database
const seedDB = async () => {
  // Delete all existing trips
  await Trip.deleteMany({});

  // Insert the seed data
  await Trip.insertMany(trips);

  console.log("Database seeded successfully!");
};

// Run the seed function and close connection
seedDB().then(() => {
  process.exit(0);
});

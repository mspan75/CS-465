const travel = (req, res) => {
  //define api endpoint
  const tripsEndpoint = "http://localhost:3000/api/trips";
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  };

  // Uncomment for debugging
  // console.log('TRAVEL CONTROLLER BEGIN');

  fetch(tripsEndpoint, options)
    .then((response) => response.json())
    .then((json) => {
      //uncomment for debugging
      //console.log(json);

      let message = null;
      if (!(json instanceof Array)) {
        message = "API lookup error";
        json = [];
      } else {
        if (!json.length) {
          message = "No trips exist in our database";
        }
      }

      res.render("travel", {
        title: "Travlr Getaways",
        trips: json,
        message,
      });
    })
    .catch((err) => res.status(500).send(err.message));
};

module.exports = {
  travel,
};

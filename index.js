require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const PhoneNumber = require("./models/phoneNumber");

app.use(cors());
app.use(express.json());
morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});
app.use(morgan("tiny :body"));

app.get("/api/persons", (request, response) => {
  PhoneNumber.find({}).then((returnedPhoneNumbers) => {
    response.json(returnedPhoneNumbers);
  });
});

app.get("/api/persons/:id", (request, response) => {
  PhoneNumber.findById(request.params.id)
    .then((foundPerson) => {
      if (!foundPerson) {
        return response
          .status(404)
          .send({ error: "The id for that person does not exist" });
      }

      return response.json(foundPerson);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  PhoneNumber.findByIdAndDelete(request.params.id)
    .then((result) => {
      if (result) {
        response.status(204).end();
      } else {
        response
          .status(404)
          .json({ error: "The id for that person does not exist" });
      }
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;
  console.log("body: ", body);

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "Invalid request body",
    });
  }

  const newPerson = new PhoneNumber({
    name: body.name,
    number: body.number,
  });

  newPerson
    .save()
    .then((savedPerson) => {
      response.status(201).json(savedPerson);
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body;
  PhoneNumber.findById(request.params.id)
    .then((person) => {
      if (!person) {
        return response.status(404).json({ error: "person not found" });
      }

      person.name = name;
      person.number = number;

      person.save().then((updatedPerson) => {
        response.json(updatedPerson);
      });
    })
    .catch((error) => next(error));
});

app.get("/info", (request, response) => {
  PhoneNumber.find({})
    .then((persons) => {
      response.send(
        `<div><p>The phonebook has info for ${
          persons.length
        } people</p><p>${new Date()}</p></div>`
      );
    })
    .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).json({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log(`Listening on port ${3000}`);

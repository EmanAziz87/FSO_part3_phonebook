const mongoose = require("mongoose");

const password = process.env.MONGO_BACKEND_API_PASSWORD;

const url = `mongodb+srv://azizeman467:${password}@cluster0.xqn6w5o.mongodb.net/phoneBookApp?appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url, { family: 4 });

const phoneBookSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: Number,
    minLength: 8,
    required: true,
    validate: {
      validator: function (v) {
        return /\d{3}-\d{3}-\d{4}/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
});

phoneBookSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    (returnedObject.id = returnedObject._id.toString()),
      delete returnedObject.__v,
      delete returnedObject._id;
  },
});

module.exports = mongoose.model("PhoneNumber", phoneBookSchema);

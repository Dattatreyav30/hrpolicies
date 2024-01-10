const mongoose = require("mongoose");

const headingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subheadings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subheading" }],
});

const Heading = mongoose.model("Heading", headingSchema);

module.exports = Heading;

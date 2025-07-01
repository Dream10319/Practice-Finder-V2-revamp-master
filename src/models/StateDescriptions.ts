import mongoose from "mongoose";

const stateSchema = new mongoose.Schema({
  id: {
    type: Number,
  },
  state: {
    type: String,
  },
  description: {
    type: String,
  },
  association: [
    {
      name: {
        type: String,
      },
      location: {
        type: String,
      },
      phone: {
        type: String,
      },
      url: {
        type: String,
      },
    },
  ],
});

const StateDescriptions = mongoose.model("statedescriptions", stateSchema);

export default StateDescriptions;

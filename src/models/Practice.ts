import mongoose from "mongoose";

const practiceSchema = new mongoose.Schema({
  id: {
    type: Number,
  },
  name: {
    type: String,
  },
  state: {
    type: String,
  },
  city: {
    type: String,
  },
  price: {
    type: String,
  },
  type: {
    type: String,
  },
  operatory: {
    type: Number,
  },
  annual_collections: {
    type: String,
  },
  square_ft: {
    type: String, //String
  },
  content: [
    {
      _id: false,
      key: {
        type: String,
      },
      value: {
        type: String,
      },
    },
  ],
  admin_content: [
    {
      _id: false,
      key: {
        type: String,
      },
      value: {
        type: String,
      },
    },
  ],
  details: {
    type: String,
  },
  source_link: {
    type: String,
  },
  origin: {
    type: String,
  },
});

const Practice = mongoose.model("practices", practiceSchema);

export default Practice;

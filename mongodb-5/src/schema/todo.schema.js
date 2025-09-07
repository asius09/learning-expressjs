const mongoose = require("mongoose");
const { Schema } = mongoose;
const TodoSchema = new Schema(
  {
    title: { type: String, require: true, trim: true },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Todo = mongoose.model("Todo", TodoSchema);
module.exports = Todo;

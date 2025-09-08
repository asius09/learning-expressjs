const mongoose = require("mongoose");
const { Schema } = mongoose;

const TodoSchema = new Schema(
  {
    title: {
      type: String,
      require: [true, "Todo title is required"],
      minlength: [3, "Title must be at least 3 characters"],
      trim: true,
    },
    completed: { type: Boolean, default: false },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
  },
  { timestamps: true }
);

TodoSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

TodoSchema.post("findOneAndDelete", function (doc) {
  if (doc) {
    console.log(`Todo with title ${doc.title} was Deleted`);
  }
});

TodoSchema.index({ createdAt: -1 });

const Todo = mongoose.model("Todo", TodoSchema);
module.exports = Todo;

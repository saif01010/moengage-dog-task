import mongoose from "mongoose";
const ListSchema = new mongoose.Schema({
    name: String,
    data: [
      {
        code: String,
        imageUrl: String,
      }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
  }, { timestamps: true });
  
const List = mongoose.models.List || mongoose.model("List", ListSchema);
export default List;
const mongoose=require('mongoose');
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true }
}, { timestamps: true });

module.exports=mongoose.model("Item",itemSchema);
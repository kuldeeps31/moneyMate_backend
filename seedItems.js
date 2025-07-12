const mongoose = require("mongoose");
const Item = require("./models/Item");
require("dotenv").config();

const items = [
  "Pattal", "Chai", "Spoon", "Glass", "Nasta", "Plates",
  "Paper Glass", "Butter Paper", "Kata Paper", "Neck Container",
  "Silver Foil", "Fuel", "Wipping", "Kapda"
];

const seedItems = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    for (let name of items) {
      await Item.updateOne({ name }, { $set: { name } }, { upsert: true });
    }
    console.log("✅ Items seeded successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

seedItems();

require('dotenv').config();

const getAdminProfile = (req, res) => {
  try {
    const name = process.env.ADMIN_NAME || "Admin";
   const photo = `${req.protocol}://${req.get('host')}${process.env.ADMIN_PHOTO}`;
    return res.status(200).json({ name, photo });
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAdminProfile,
};


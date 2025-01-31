const User = require("../models/UserModal");

const getUser = async (req, res) => {
  const { email, name, date } = req.query;

  try {
    let query = {};

    if (email) {
      query.email = { $regex: email, $options: "i" };
    }

    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    if (date) {
      const parsedDate = new Date(date);
      query.createdAt = { $gte: parsedDate };
    }

    const users = await User.find(query);

    res.status(200).json({
      data: users,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error",
    });
  }
};

module.exports = {
  getUser,
};

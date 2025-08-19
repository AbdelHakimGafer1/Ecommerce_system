const { verifyToken } = require("../utils/auth");

module.exports = async (req, res) => {
  try {
    const user = verifyToken(req);

    res.status(200).json({
      message: "Protected route",
      user,
    });
  } catch (error) {
    res.status(401).json({ message: "Unauthorized", error: error.message });
  }
};


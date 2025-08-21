const { refreshAccessToken } = require("../../utils/auth");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  try {
    const { refreshToken } =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Missing refreshToken" });
    }

    const newAccessToken = await refreshAccessToken(refreshToken);

    res.status(200).json({
      message: "Access token refreshed successfully",
      accessToken: newAccessToken,
    });
  } catch (err) {
    console.error("Refresh Token Error:", err.message);
    res.status(401).json({ message: err.message });
  }
};


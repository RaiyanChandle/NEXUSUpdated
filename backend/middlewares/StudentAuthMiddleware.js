import jsonwebtoken from "jsonwebtoken";

export const studentAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });
    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    req.Studentid = decoded.id;
    next();
  } catch (e) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

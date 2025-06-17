import jwt from "jsonwebtoken";

export default function verifyToken(req, res, next) {
   
  const authHeader = req.headers.authorization;
  console.log("Authorization Header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded); // Debugging line to check decoded token
    req.user = { id: decoded.userId };         // attach user id to request
    console.log("Decoded User ID:", req.user); // Debugging line to check decoded user ID
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid or expired" });
  }
}

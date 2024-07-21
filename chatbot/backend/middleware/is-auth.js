const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.get("Authorization").split(" ")[1];
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, "veryverysecret");
  } catch {
    const err = new Error("Internal Server Error");
    err.statusCode = 500;
    throw err;
    // console.log(err);
    throw err;
  }

  if (!decodedToken) {
    const error = new Error("Not Authenticated");
    error.statusCode = 401;
    throw error;
  }

  req.userId = decodedToken.userId;

  next();
};

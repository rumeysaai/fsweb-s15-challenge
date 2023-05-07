const jwt = require("jsonwebtoken")
const JWT_SECRET = process.env.JWT_SECRET || "shh";

module.exports = (req, res, next) => {
  
  /*
    EKLEYİN

    1- Authorization headerında geçerli token varsa, sıradakini çağırın.

    2- Authorization headerında token yoksa,
      response body şu mesajı içermelidir: "token gereklidir".

    3- Authorization headerında geçersiz veya timeout olmuş token varsa,
    response body şu mesajı içermelidir: "token geçersizdir".
  */
  try {

    const authHeader = req.headers["authorization"];
    if (authHeader) {
      jwt.verify(authHeader, JWT_SECRET, (err, decodedToken) => {
        if (err) {
          res.status(401).json({ message: "token geçersizdir" })
        }
        else {
          req.decodedToken = decodedToken;
          next();
        }
      })
    }
    else {
      res.status(400).json({ message: "token gereklidir" })
    }

  } catch (error) {
    next(error);
  }
};

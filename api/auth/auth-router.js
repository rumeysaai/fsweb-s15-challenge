const router = require('express').Router();
const User = require("./auth-model");
const jwt=require("jsonwebtoken")
const JWT_SECRET = process.env.JWT_SECRET || "shh";
const bcryptjs = require("bcryptjs")
const { payloadCheck, usernameCheck, loginPasswordCheck } = require("./auth-middleware");
function generateToken(payload, expireTime){
  return jwt.sign(payload, JWT_SECRET, {expiresIn:expireTime});
}

router.post('/register', payloadCheck, usernameCheck, async (req, res,next) => {
  
  /*
    EKLEYİN
    Uçnoktanın işlevselliğine yardımcı olmak için middlewarelar yazabilirsiniz.
    2^8 HASH TURUNU AŞMAYIN!

    1- Yeni bir hesap kaydetmek için istemci "kullanıcı adı" ve "şifre" sağlamalıdır:
      {
        "username": "Captain Marvel", // `users` tablosunda var olmalıdır
        "password": "foobar"          // kaydedilmeden hashlenmelidir
      }

    2- BAŞARILI kayıtta,
      response body `id`, `username` ve `password` içermelidir:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- Request bodyde `username` ya da `password` yoksa BAŞARISIZ kayıtta,
      response body şunu içermelidir: "username ve şifre gereklidir".

    4- Kullanıcı adı alınmışsa BAŞARISIZ kayıtta,
      şu mesajı içermelidir: "username alınmış".
  */

  try {

    const model = { username: req.body.username, password: bcryptjs.hashSync(req.body.password) };
    const insertedRecord = await User.create(model);
    res.status(201).json(insertedRecord);

  } catch (error) {
    next(error)
  }

});

router.post('/login', payloadCheck, loginPasswordCheck, async(req, res, next) => {
 
  /*
    EKLEYİN
    Uçnoktanın işlevselliğine yardımcı olmak için middlewarelar yazabilirsiniz.

    1- Var olan bir kullanıcı giriş yapabilmek için bir `username` ve `password` sağlamalıdır:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- BAŞARILI girişte,
      response body `message` ve `token` içermelidir:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- req body de `username` ya da `password` yoksa BAŞARISIZ giriş,
      şu mesajı içermelidir: "username ve password gereklidir".

    4- "username" db de yoksa ya da "password" yanlışsa BAŞARISIZ giriş,
      şu mesajı içermelidir: "geçersiz kriterler".
  */
  try {

    const payload = {username: req.body.username};
    const token = generateToken(payload, "1d");
    res.json({message:`welcome, ${req.body.username}`, token:token});

  } catch (error) {
    next(error);
  }
});

module.exports = router;

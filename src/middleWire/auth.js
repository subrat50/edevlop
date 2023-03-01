const jwt=require("jsonwebtoken")

const authenticate = async function (req, res, next) {

    try {
  
       let token = (req.headers.authorization)
    
      if (!token) {
        return res.status(400).send({ status: false, msg: "Token required! Please login to generate token" });
      }
      let newtoken=token.split(" ")

      jwt.verify(newtoken[1], "abcdefg", { ignoreExpiration: true }, function (error, decodedToken) {

        if (error) {
          return res.status(401).send({ status: false, msg: "Token is invalid!" });
        } else {
          if (Date.now() > decodedToken.exp * 1000) {
            return res.status(401).send({ status: false, msg: "Session Expired" });
          }
          req.userId = decodedToken.userId;
          
          next();
        }
      }
      )
    
    } catch (err) {
      res.status(500).send({ msg: "Internal Server Error", error: err.message });
    }
    
}

module.exports={authenticate}
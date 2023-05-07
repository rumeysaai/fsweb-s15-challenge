const User = require("./auth-model");
const bcryptjs = require("bcryptjs");

function payloadCheck(req, res, next) {
    try {

        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).json({message:"username ve password gereklidir"})
        }
        else{
            next();
        }

    } catch (error) {
        next(error);
    }
}

async function usernameCheck ( req,res,next){
    try {
        
        const {username} = req.body;
        const user = await User.getByFilter({username:username});
        if(user && user.id > 0){
            res.status(400).json({message:"username alınmış"})
        }
        else{
            next();
        }

    } catch (error) {
        next(error);
    }
}

async function loginPasswordCheck(req,res,next){
    try {
        
        const {username, password} = req.body;
        const user = await User.getByFilter({username:username});
        if(!user){
            res.status(400).json({message:"Böyle bir kullanıcı yok"})
        }
        else{
            let isPasswordValid = bcryptjs.compareSync(password, user.password);
            if(!isPasswordValid){
                res.status(400).json({message:"geçersiz parola"});
            }
            else{
                next();
            }
        }
    
    } catch (error) {
        next(error)
    }
}

module.exports={
    payloadCheck,
    usernameCheck,
    loginPasswordCheck
}
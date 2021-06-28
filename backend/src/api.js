const Name = require('./models/name')
var crypto = require('crypto');
var cookietoemail=new Map()
var emailtocookie=new Map()
function _uuid() {
    var d = Date.now();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
      d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }
const cookiegen = ()=>{
    let cookie = ""
    do{
        cookie=_uuid()
    }while(cookietoemail.has(cookie))
    return cookie
}

const newcookie=(email)=>{
    existcookie = emailtocookie.get(email)
    if(existcookie) return existcookie
    let cookie = cookiegen()
    emailtocookie.set(email,cookie)
    cookietoemail.set(cookie,email)
    return cookie
}

const hash=(password)=>{
    // console.log(crypto.createHash('sha256').update("othello").update(password).digest('hex'))
    return crypto.createHash('sha256').update("connect_four").update(password).digest('hex');
}
exports.cookie2email=()=>cookietoemail;
exports.email2cookie=()=>emailtocookie;;
exports.checklogin=async (req,res)=>{
    
    let cookie = req.signedCookies.connect_four
    if(!cookie){
        res.json({status:400,content:"cookie not exist"})
        return  
    }
    let email = cookietoemail.get(cookie)
    if(!email){
        res.clearCookie('connect_four').json({status:400,content:"cookie not valid"})    
        return
    }
    res.json({status:200,content:"login success",email:email})
    
}
exports.login=async (req,res)=>{
    
    let {email,password} = req.body
    let user = await Name.findOne({email:email},(err)=>{
        if(err){
            throw err
            console.log(err)
        }
    })
    if(!user){
        res.json({status:400,content:'email not exist'})
        return
    }
    if(hash(password)!==user.password){
        res.json({status:400,content:'password wrong'})
        return
    }
    res.cookie('connect_four',newcookie(email), {signed:true}).json({status:200,content:''})
    

}
exports.logout=async (req,res)=>{
    res.clearCookie('connect_four').json({status:200,content:''})
}
const check=(email,password)=>{
    if(!email || !email.includes("@")){
        return 'email invalid'
    }
    


    if(!password){
         return 'password invalid'
    }
    if(password.length<6){
        return 'password too short (should >=6)'
    }
    if(password.length>15){
        return 'password too long (should <=15)'
    }
    
     return undefined
}
exports.register=async (req,res)=>{
    let {email,password,firstName,lastName} = req.body
    console.log(email)
    let err= check(email,password)
    if(err){
        res.json({status:400,content:err})
        return
    }
    if(await Name.findOne({email:email})){
        res.json({status:400,content:'email already exist'})
        return
    }
    await Name.create({email:email,password:hash(password),name:`${firstName}_${lastName}`,history:{win:0,lost:0}},(err)=>{
        if(err) throw err
        console.log("OK")
    })
    res.cookie('connect_four',newcookie(email), {signed:true}).json({status:200,content:''})
}

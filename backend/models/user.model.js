const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        minlength:[6, 'Email must be 6 characters long']

    },
    password:{
        type:String,
select:false
    }
})

userSchema.statics.hashPassword = async function(password){
    return await bcrypt.hash(password,10);
}

userSchema.methods.isValidPassword = async function(password){
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateJWT = function () {
    return jwt.sign({email:this.email} , process.env.JWT_SECRET,
{expiresIn:'24h'}
)}




module.exports = mongoose.model('User',userSchema);
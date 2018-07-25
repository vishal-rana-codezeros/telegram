const mongoose = require('mongoose');


const schema = mongoose.Schema;

const userSchema = new schema({
	firstName:String,
	lastName:String,
	userName:{type:String,required:true},
	userId:String,
	token:String,
	createdAt:{type:Date,default:Date.now},
	bot_userName:String,
	group:String,
	groupId:String
},
{
	strict:false
});




module.exports = mongoose.model('user',userSchema);
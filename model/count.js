const mongoose = require('mongoose');

const Schema  = mongoose.Schema;

const countSchema  = new Schema({
	userName:{type:String,required:true},
	countingDetails:[{
		userId:String,
		username:String,
		firstName:String,
		lastName:String,
		chatId:String,
		groupName:String
	}]
},{
	strict:false
});


module.exports = mongoose.model('count',countSchema);
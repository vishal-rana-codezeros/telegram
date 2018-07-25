const express = require('express');
const app = express();
const mongoose  = require('mongoose');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
const cheerio = require('cheerio');
const request = require('request');
const path = require('path');
const token = '571559169:AAHr2wp6Xn1GYojXXcKczUZHY--FI3joPaQ';
const token2 = '609823111:AAE7b0sJS20Ig1PT3Cv4Wq1v-1Z5Chwd12I';

const User = require('./model/user');
const Count = require('./model/count');




// // Create a bot that uses 'polling' to fetch new updates
// const bot = new TelegramBot(token,{polling:true});
// console.log(bot)
// bot.setBots(token2)
mongoose.connect('mongodb://localhost:27017/telegram', { useNewUrlParser: true} )




app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// app.use(express.static(path.join(__dirname+'public')))
app.use('/',express.static(process.cwd()+'/public'));

// let array_users = [];
app.set('port',process.env.PORT || 8090);
// TelegramBot.setBots([token,token2],{polling:true});


// bot.onText(/\/echo (.+)/, (msg, match) => {
//   // 'msg' is the received Message from Telegram
//   // 'match' is the result of executing the regexp above on the text content
//   // of the message
//  console.log(msg)
//   const chatId = msg.chat.id;
//   const resp = match[1]; // the captured "whatever"
 
//   // send back the matched "whatever" to the chat
//   bot.sendMessage(chatId, resp);
// });
 
// Listen for any kind of message. There are different kinds of
// messages.








// bot.on('message', (msg) => {
// 	console.log("in bot"+JSON.stringify(msg))
//   const chatId = msg.chat.id;
//  	var obj = {
//  		firstName:msg.from.first_name,
//  		lastName:msg.from.last_name,
//  		userName:msg.from.username
//  	}

//  	var checking_exist = {};
//  	if(array_users.length ==0){
//  		array_users.push(obj)
//  	}else{
//  		checking_exist = array_users.filter(value=>(value.userName == obj.userName))
//  		if(checking_exist.length==0){
//  			array_users.push(obj);
//  		}
//  	}
//  	console.log(array_users);
 	
//   // send a message to the chat acknowledging receipt of their message
  // bot.sendMessage(536863629, 'sending');
// });


// bot.on('getUpdates',(msg)=>{
// 	console.log("checking updates........")
// });



// app.get('/getUpdates',(req,res)=>{
// 	console.log("update");
// 	 // function getUpdate(){

// 		 request(`https://web.telegram.org/#/im?p=g290984110`,(error, response, body)=>{

// 			console.log(body);
// 			return res.json({code:200})
// 		})


// 	// }
// 	// return 
// })


app.post('/addDetails',(req,res)=>{
	let user = new User(req.body);
	user.save((err,data)=>{
		if(err)return err;
		else{
			return res.json({code:200,data:data})
		}
	})
})


app.get('/getAllGroups/:username', (req, res) => {
	Count.findOne({userName:req.params.username},(err,data)=>{
		return (err) ? res.json({code:400}) :res.json({code:200,data:data.countingDetails});		
	})
})


app.get('/sendMessage/:username', async (req, res) => {

    var getToken = await User.findOne({ userName: req.params.username }).select('token');
    console.log(getToken)
    const new_bot = new TelegramBot(getToken.token, { polling: true });
    Count.findOne({ userName: req.params.username }, (err, data) => {
        if (err) {
            throw err;
        } else {
            console.log(data)
            data.countingDetails.map((result) => {
                console.log(result.userId)
                new_bot.sendMessage(result.userId, "Hi from bot!!");
            })
            console.log("stop polling")
            //new_bot.stopPolling();
            return res.json({ code: 200 })
        }
    })
})

app.get("/listen/:username/:time",async (req,res)=>{

    const result = await new Promise((resolve, reject) => {
        let array_user = []
        console.log(req.params);
        User.findOne({ userName: req.params.username }, (error, data) => {

            if (error) { reject(error) }
            else {
                console.log("in else")
                var bot = new TelegramBot(data.token, { polling: true });
               
                bot.on('message', (msg) => {
                    let obj = {}
                    console.log("in bot" + JSON.stringify(msg))
                    let chatId = msg.chat.id;
                    obj = {
                        firstName: msg.from.first_name,
                        lastName: msg.from.last_name,
                        userName: msg.from.username,
                        group: msg.chat.title,
                        groupId: chatId,
                        userId: msg.from.id
                    };

                    var checking_exist = {};
                    if (array_user.length == 0) {
                        array_user.push(obj)
                    } else {
                        checking_exist = array_user.filter(value => (value.userName == obj.userName))
                        if (checking_exist.length == 0) 
                            array_user.push(obj);
                          
                    };

                    if (array_user.length > 0) {
                        console.log('has new value');
                        Count.findOne({ userName: req.params.username, "countingDetails.userId": obj.userId }, (err,exist) => {
                            if (err) reject(err);
                            else if(!exist) {
                                Count.findOneAndUpdate({ userName: req.params.username },
                                    {
                                        $addToSet: {
                                            countingDetails:
                                                { userId: obj.userId, username: obj.userName, firstName: obj.firstName, lastName: obj.lastName, chatId: obj.groupId, groupName: obj.group }
                                        }
                                    }, { upsert: true }, (err, inserted) => {

                                        if (err) reject(err);
                                        else {
                                            resolve(inserted);
                                        }


                                    });
                            }
                        })
                       
                    }                  
                });

                setTimeout(function () {
                    console.log("stop polling")
                    bot.stopPolling();
                }, 120000)
            }
        });
    });
	return res.json({"responseCode":200,"responseMessage":"Listening to request",data:result})
});


app.get('/stopPolling/:userId',(req,res)=>{

})



    app.listen(app.get('port'), () => {
        console.log(`Listening on ${app.get('port')}`)
    });
//important note for developers :
//Remember : Node by default follows asynchronous execution 
// so if you try to fire query inside query you have to take care that
//previous connection with database is not closed outside
//callback function of that query or else you have to make 
//new connection object again for second queary. 
//so close connection with database keeping in mind node is aynchronous 

const config = require("config");
//express
const express = require("express");
var userBasicFunctionsRouter =  express.Router() ;
//mysql_db
const mysql = require("mysql");
const dbConfig = config.get("dbConfig") ;
//jwt json web token
const jwt = require('jsonwebtoken')
var secretKey = config.get("secretKey") ;

//nodemailer's trasporter object to send opt on mail
const transporter = require("nodemailer").createTransport(config.get("mailConfig"));

//otp generator
const generateOtp = require("../utils/otpGenerator");
const logTime = require("../utils/logTime");

 

userBasicFunctionsRouter.post("/signuprequest", (req, resp) => {
    const userdata  = req.body;
    var connection = mysql.createConnection(dbConfig) ;
    connection.connect() ;
    var sqlQuery1 =  `select count(*) userCount from user where email = '${userdata.email}' or mobile = '${userdata.mobile}' `
    connection.query(sqlQuery1 , (err , result)=>{
        if(err){
            console.log(logTime()+": error code 101 :"+err) ; 
            resp.status(500).json({"errorFlag" : true ,
            "msg" : "error code 101 occured , please contact customer suport !!"})
            connection.end() ;
        }
        else{
            var userCount = result[0].userCount ; 
            if(userCount == 0){
                var otp = generateOtp() ; 
                //creating email messge 
                var emailObject = {
                //from: 'examwala.webapp@gmail.com', // Sender email
                from: 'recruitment.ncl.2024@gmail.com', // Sender email
                to: userdata.email, // List of recipients
                subject: 'Exam wala web app OTP verification', // Email subject
                html:  `
                Dear <b> ${userdata.fname} ,</b>
                <p> Thank you for trusting <b> Exam-wala <b> 📚 ✍️ 🎯 🏆 <br/>
                Your One-Time Password (OTP) for verification is: 
                <center>
                <span style="font-weight: bold; color: #ff0000; font-size: 24px;">${otp}</span><br/><br/>
                </center>
                <hr/>
                If you have not initiated this request, please contact our support immediately.
                <hr/>
                Regards,<br/>
                Exam-Wala Web App.
                <p>`
                 }; //end of emailObject
                transporter.sendMail(emailObject, function(err, info) {
                    if (err) {
                        console.log(logTime()+" : "+err) ; 
                        connection.end() ;
                        resp.status(500).json({"errorFlag" : true ,
                         "msg" : "error code 301 occured , please contact customer support !!"}) ; 
                        return ; 
                    } 
                    else {   
                        console.log("Email sent to : " + userdata.email)
                        var sqlQuery2 = `insert into otp_validation (otp , fname , lname, email , mobile , password) values ( ${otp} ,  '${userdata.fname}', '${userdata.lname}' , '${userdata.email}' , '${userdata.mobile}' , '${userdata.password}' )` ; 
                        connection.query( sqlQuery2 ,    (err , result) => {
                            if(err){
                                console.log(logTime()+` :error code 102 : user_email : ${userdata.email} :----->  ${err} `) ; 
                                resp.status(500).json({"errorFlag" : true ,
                                "msg" : "error code 102 occured , please contact customer support !!"}) ; 
                                return ; 
                            }
                            else{
                                resp.send({
                                    "errorFlag" : false ,
                                    "msg" : "otp sent to email" ,
                                }) ;
                                return ;
                            }
                        }) ; //end of sqlQuery2 
                        connection.end() ; 
                        }
            }); //transporter.sendMail()  
          }
          else { //user with given email or mobile already exists in database 
            console.log(logTime()+": error code 201 : email or password already exists in database") ; 
            resp.status(409).json({"errorFlag" : true ,
            "msg" : "error code 201 occured , user with given email or mobile already exists !!"})
            connection.end() ;
        }
        }
    })//end of sqlQuery1  
}); //end of userBasicFunctionsRouter.post("/signup")

userBasicFunctionsRouter.post("/verifyotp", (req, resp) => {
var connection = mysql.createConnection(dbConfig) ; 
var {email , otp} = req.body ;  
connection.connect() ; 
var sqlQuery1 = `select * from otp_validation where email = '${email}' and otp = ${otp} `
connection.query(sqlQuery1 , (err , result)=>{
if(err){
connection.end() ; 
console.log(logTime()+" : "+err) ; 
resp.status(500).json({"errorFlag" : true ,
"msg" : "error code 103 occured , please contact customer support !!"}) ; 
return ; 
}
else{
    if(result[0]){
        var {fname , lname , mobile , email , password } = result[0] ; 
        var sqlQuery2 = `insert into user (fname , lname , email , mobile , password) values ( '${fname}' , '${lname}' , '${email}' , '${mobile}' , '${password}' )` ; 
        connection.query(sqlQuery2 , (err , result)=>{
            if(err){ 
                    connection.end() ;
                    console.log(logTime()+" : "+err) ; 
                    resp.status(500).json({"errorFlag" : true ,
                    "msg" : "error code 104 occured , please contact customer support !!"}) ; 
                    return ; 
            }
            else{
                var sqlQuery3 = `delete from otp_validation where email= '${email}' ; ` ; 
                connection.query(sqlQuery3, (err , result)=>{
                    if(err){
                        console.log(logTime()+" : error code 105 : "+err) ; 
                    }
                }) // end of sqlQuery3 
                connection.end() ; 
                resp.send({"errorFlag" : false ,
                "msg" : "User account created successfully !!!"}) ; 
                return  ;
            }
        })//end of sqlQuery2
        
    }
    else{
        console.log(logTime() + ": email : "+ req.body.email + " : This user entered invalid otp") ; 
        resp.status(401).json({"errorFlag" : true ,
        "msg" : "error code 202 : invalid otp for the given email address "}) ; 
        return ;  
    }
}})//end of sqlQuery1
})//end of userBasicFunctionsRouter.post("/verifyOtp")


userBasicFunctionsRouter.post("/login", (req, resp) => {
    const { username, password } = req.body;
    var connection = mysql.createConnection(dbConfig) ;
    connection.connect() ; 
    //I tested below query and is working perfectly fine.
    //select * from user where (email = 'grvbng7@gmail.com' or mobile = 'grvbng7@gmail.com' ) and password = 'sunbeam'   ;
    var queryString =  `select id , fname , lname  from user where (email = '${username}' or mobile = '${username}') and password = '${password}'   ; `
    connection.query(queryString , (err , result) => {
        if(err) 
        {
            resp.statusCode = 500 ;
            resp.send({
                "errorFlag" : true ,
                "msg" : "database error" ,
            }) ;
            return;
        }
        else 
        {
            if(result.length == 0 )
            {
                resp.statusCode = 401;
                resp.send({
                    "errorFlag" : true ,
                    "msg" : "Invalid username or password" ,
                }) ;
                return; 
            }
            else{
            var {id , fname , lname } =   result[0] ; 
            var userData  = {fname , lname} ; 
            const token = jwt.sign({ userId: id }, secretKey);
            resp.statusCode = 200 ;
            resp.status(200).json({ "errorFlag" : false ,  "token" : token , "user" : userData }) ; 
            return ;
            }
        }
    }) //end of connection.query() 
    //closing database connection 
    connection.end() ; 
});



module.exports =  userBasicFunctionsRouter ;
//importing required packages 
var express = require("express");
var config = require("config");
var port = config.get("serverPort");
var secretKey = config.get("secretKey")
var verifyToken = require("./utils/verifyTockenMiddleware")
var cors = require("cors") ; 

//importing routes - open
const freeSeriesRouter = require("./routes/freeSeries");
const userBasicFunctionsRouter = require("./routes/userBasicFunctionalityRoutes")
//importing routes-protected
const seriesRouter = require("./routes/myseries");
const freeInfo = require("./routes/freeInfo");
const userProfileFunctionsRouter = require("./routes/userProfileFunctionality");
const imgHandler = require("./routes/imgHandlerRoute");
var app =  express() ; 
//If you dont use cors() package and try to manually setup the headers , It is causing error in api calls with Authorization headers
app.use(cors()); 
app.use(express.json());

// app.use((req ,resp , next)=>{ 
//     console.log("Flag 100") ; 
//     resp.setHeader("Access-Control-Allow-Origin", "*");
//     resp.setHeader("Access-Control-Allow-Methods", "*");
//     resp.setHeader("Access-Control-Allow-Headers", "*") ;
//     //resp.header('Access-Control-Allow-Credentials', 'true');
//     next() ;  
// })
//api calls that dont require jwt tocker verification 
app.use("/user" , userBasicFunctionsRouter )
app.use("/freeseries" , freeSeriesRouter) ;
// "/f" show information which is freely available to all the students
app.use("/f" , freeInfo) ; 
app.use("/q/img" , imgHandler ) ; //q stands for question image 

//api calls that require jwt tocker verification
app.use("/myseries" ,verifyToken , seriesRouter) ;
app.use("/myprofile" ,verifyToken , userProfileFunctionsRouter) ;
app.listen(port, () => { console.log("server started on port : "+port); });


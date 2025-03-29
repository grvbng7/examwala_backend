const config = require("config");
//express
const express = require("express");
var userProfileFunctionsRouter =  express.Router() ;
//mysql_db

const mysql = require("mysql");
const dbConfig = config.get("dbConfig") ;
const logTime = require("../utils/logTime");

 

userProfileFunctionsRouter.get("/", (req, resp) => {
    var userId ; 
    try{
    userId =  req.decoded.userId ; 
    }
    catch{
        console.log(logTime+": Error code 203") ; 
        resp.status(400).json({
            "errorFlag" : true ,
            "msg" : "Error code 203 , Please contact support team" ,
        })
    }
    var connection = mysql.createConnection(dbConfig) ;
    connection.connect() ;
    var queryString =  `select id , fname , lname , email , mobile from user where id =  ${userId};`
    connection.query(queryString , (err , result) => {
        if(err) 
        {
            console.log(logTime()+": "+err) ; 
            resp.statusCode = 500 ;
            resp.send({
                "errorFlag" : true ,
                "msg" : "error code : 108 : database error" ,
            }) ; 
            return;
        }
        else 
        {
            resp.send(result[0]) ; 
            return;
        }
    }) //end of query 
    connection.end() ; 
}) //end of get "/myprofile"

userProfileFunctionsRouter.get("/testsgiven", (req, resp) => {
    var userId ; 
    try{
    userId =  req.decoded.userId ; 
    }
    catch{
        console.log(logTime+": Error code 203") ; 
        resp.status(400).json({
            "errorFlag" : true ,
            "msg" : "Error code 203 , Please contact support team" ,
        })
    }
    var connection = mysql.createConnection(dbConfig) ;
    connection.connect() ;
    var queryString =  `select analysis.series_id seriesId , series.name sname , analysis.test_id testId , test.name tname , test.marks_per_question marksPerQuestion , analysis.exam_date examDate , analysis.correct_answers correctAnswers , analysis.total_questions totalQuestions , analysis.attempted from analysis
    inner join test 
    on analysis.test_id = test.id 
    inner join series 
    on analysis.series_id = series.id
    where analysis.user_id = ${userId} 
    order by analysis.exam_date desc ;`
    connection.query(queryString , (err , result) => {
        if(err) 
        {
            console.log(logTime()+": "+err) ; 
            resp.statusCode = 500 ;
            resp.send({
                "errorFlag" : true ,
                "msg" : "error code : 108 : database error" ,
            }) ; 
            return;
        }
        else 
        {
            resp.send(result) ; 
            return;
        }
    }) //end of query 
    connection.end() ; 
}) //end of get "/myprofile/testsgiven"




module.exports =  userProfileFunctionsRouter ;
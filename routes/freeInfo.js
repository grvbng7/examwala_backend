const config = require("config");
const dbConfig = config.get("dbConfig") ; 
const express = require("express");
const mysql = require("mysql");
const logTime = require("../utils/logTime");

var freeInfo =  express.Router() ;
// /f/allseriesdata
freeInfo.get("/allseriesdata", (req ,resp) => {
    var connection = mysql.createConnection(dbConfig) ;
    connection.connect() ;  
    var queryString =  `select id , name , details , price , d_price dPrice from series where active in ('Y' , 'y') and id != 1  order by id asc ;`
    connection.query(queryString , (err , result) => {
        if(err) 
        {
            console.log(logTime()+": "+err) ; 
            resp.statusCode = 500 ;
            resp.send({
                "errorFlag" : true ,
                "msg" : "error code : 105 : database error" ,
            }) ; 
            return;
        }
        else 
        {
            resp.statusCode = 200 ; 
            resp.send({"errorFlag" : false , "data" : result}) ; 
            return ; 
        }
    }) //end of connection.query() 
    connection.end() ; 
})//end of freeInfo.get("/allseriesdata")

module.exports =  freeInfo ;

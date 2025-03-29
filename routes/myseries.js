const config = require("config");
const dbConfig = config.get("dbConfig") ; 
const express = require("express");
const mysql = require("mysql");
const logTime = require("../utils/logTime");

var mySeriesRouter =  express.Router() ;
//get information my series ( series baught by perticular user)
//series id 1 always reprents free test series 
mySeriesRouter.get("/" , (req , resp) => {
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
    var queryString =  `select id , name , details from series where id in (select series_id from token where user_id = ${userId} ) and active in ('Y' , 'y') ;`
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
            resp.statusCode = 200 ; 
            resp.send({"errorFlag" : false , "data" : result}) ; 
            return ; 
        }
    }) //end of connection.query() 
    connection.end() ; 

}) 

//get Information about perticular series 
mySeriesRouter.get("/:seriesId" , (req , resp) => {
    var seriesId = req.params.seriesId ; 
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
    var queryString =  `select id , name , details from series where id in (select series_id from token where user_id = ${userId} ) and id = ${seriesId}  and active in ('Y' , 'y') ;`
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
            resp.statusCode = 200 ; 
            resp.send({"errorFlag" : false , "data" : result[0]}) ; 
            return ; 
        }
    }) //end of connection.query() 
    connection.end() ; 

}) ;//end of get request /myseries


//get list of all the tests available in particular series 
mySeriesRouter.get("/:seriesId/tests" , (req , resp) => {
    var userId ; 
    try{
    userId =  req.decoded.userId ; 
    }
    catch{
        console.log(logTime+": Error code 203") ; 
        resp.status(400).json({
            "errorFlag" : true ,
            "msg" : "Error code 204 , Please contact support team" ,
        })
    }
    var seriesId = req.params.seriesId ; 
    var connection = mysql.createConnection(dbConfig) ;
    connection.connect() ;
    //Two checks has to be performed , 
    //1. Test info only for perticular series has to be fetched --> it was already implemented during freetest code using joins
    //2. Info has to be fetched only if user is subscribed for that perticular series
    //We can use join or subquery , in this i used joins to improve the performance. 
    var queryString =  `select test.id testId, test.name , test.description , test.duration , test.marks_per_question marksPerQuestion , (2-count(analysis.id)) pendingAttempts from test inner join series_test 
    on series_test.test_id = test.id
    inner join token 
    on token.series_id = series_test.series_id  
    left outer join analysis 
    on analysis.test_id = test.id and analysis.user_id =token.user_id and token.series_id = analysis.series_id
    where series_test.series_id = ${seriesId} and token.user_id = ${userId}
    group by test.id , test.name , test.description , test.duration
    order by test.id ;`
    connection.query(queryString , (err , result) => {
        if(err) 
        {
            console.log(err) ; 
            resp.send({
                "errorFlag" : true ,
                "msg" : "database error" ,
            } ) ; 
            return;
        }
        else 
        {
            resp.statusCode = 200 ; 
            resp.send(result) ; 
            return ; 
        }
    }) //end of connection.query() 
    connection.end() ; 
}) ;//end of get request /freeseries/:seriesId/tests"

//get list of all the question ids  in perticular test
//no protection provided here because someone cant to anything just by checking the question ids
//protected checks are performed in api call where we have to protect the question data from unauthorised student 
mySeriesRouter.get("/test/:testId" , (req , resp) => { 
    var testId = req.params.testId ;  
    var connection = mysql.createConnection(dbConfig) ;
    connection.connect() ; 
    var queryString =  `select quest_id from test_quest where test_id = ${testId} order by quest_id ;`
    connection.query(queryString , (err , result) => {
        if(err) 
        {
            console.log(err) ;
            resp.send({
                "errorFlag" : true ,
                "msg" : "database error" ,
            } ) ; 
            return;
        }
        else 
        {
            resp.statusCode = 200 ;
            var arr =  result.map((x) => { return x.quest_id })
            resp.send( {'questionIds' : arr}) ; 
            return ; 
        }
    }) //end of connection.query() 
    connection.end() ; 
}) ;//end of get request ("myseries/test/:testId") 




//example url : /myseries/2/25/10
mySeriesRouter.get("/:seriesId/:testId/:questId", (req, resp) => { 
    var userId ; 
    try{
    userId =  req.decoded.userId ; 
    }
    catch{
        console.log(logTime+": Error code 203") ; 
        resp.status(400).json({
            "errorFlag" : true ,
            "msg" : "Error code 205 , Please contact support team" ,
        })
    }
    var {seriesId , testId , questId}  =  req.params  ;
    var connection = mysql.createConnection(dbConfig) ;
    connection.connect() ;  
    //var queryString =  `select question.id , question.question , question.o1 , question.o2 , question.o3 , question.o4 , question.imageName from question inner join test_quest on test_quest.quest_id = question.id where test_quest.test_id = ${testId} and question.id = ${questId} ;`
    var queryString1 = `select count(*) attemptCount from analysis where user_id = ${userId} and series_id = ${seriesId} and test_id = ${testId} ;`
    connection.query(queryString1 , (err1 , result1) => {
        if(err1) 
        {
            console.log(err1) ; 
            resp.statusCode = 500 ;
            resp.send({
                "errorFlag" : true ,
                "msg" : "database error" ,
            }) ; 
            connection.end() ; 
            return;
        }
        else  //if first query is successfull
        {
                        
            if(parseInt(result1[0].attemptCount) >= 2 )
            {
                    resp.status(400)
                    .json({
                        "errorFlag" : true ,
                        "msg" : "You can not proceed further ! Contact supports team !!" ,
                        }) ;
                     connection.end() ;  
            return ;    
            }  
            else{
                var queryString2 =  `select question.id , question.question , question.o1 , question.o2 , question.o3 , question.o4 , question.imageName
                from question 
                inner join test_quest 
                on test_quest.quest_id = question.id 
                inner join series_test
                on series_test.test_id = test_quest.test_id
                inner join token
                on token.series_id = series_test.series_id 
                where series_test.series_id = ${seriesId} and test_quest.test_id = ${testId} and question.id = ${questId} and token.user_id = ${userId} ;`
                connection.query(queryString2 , (err2 , result2) => {
                    if(err2) 
                    {
                        console.log(err1) ; 
                        resp.statusCode = 500 ;
                        resp.send({
                            "errorFlag" : true ,
                            "msg" : "database error" ,
                        }) ; 
                        return;
                    }
                    else  //if first query is successfull
                    {
                        resp.statusCode = 200 ; 
                        resp.send(result2[0]) ; 
                        return ;
                    }}) //end of connection.query2()
                    connection.end() ; 
            } 
        }
    }) //end of connection.query1() 

})

//example url : /myseries/analysis/2/2/23
mySeriesRouter.get("/analysis/:seriesId/:testId/:questId", (req, resp) => { 
    var userId ; 
    try{
    userId =  req.decoded.userId ; 
    }
    catch{ 
        console.log(logTime+": Error code 203") ; 
        resp.status(400).json({
            "errorFlag" : true ,
            "msg" : "Error code 205 , Please contact support team" ,
        })
    }
    var {seriesId , testId , questId}  =  req.params  ;
    var connection = mysql.createConnection(dbConfig) ;
    connection.connect() ;  
    //var queryString =  `select question.id , question.question , question.o1 , question.o2 , question.o3 , question.o4 from question inner join test_quest on test_quest.quest_id = question.id where test_quest.test_id = ${testId} and question.id = ${questId} ;`
    var queryString1 = `select count(*) attemptCount from analysis where user_id = ${userId} and series_id = ${seriesId} and test_id = ${testId} ;`
    connection.query(queryString1 , (err1 , result1) => {
        if(err1) 
        {
            console.log(err1) ; 
            resp.statusCode = 500 ;
            resp.send({
                "errorFlag" : true ,
                "msg" : "database error" ,
            }) ; 
            connection.end() ; 
            return;
        }
        else  //if first query is successfull
        {
            if(parseInt(result1[0].attemptCount) > 2 )
            {
                    resp.status(400)
                    .json({
                        "errorFlag" : true ,
                        "msg" : "You can not proceed further ! Contact supports team !!" ,
                        }) ;
                     connection.end() ;  
            return ;    
            }  
            else{
                var queryString2 =  `select question.id , question.question , question.o1 , question.o2 , question.o3 , question.o4 , question.imageName , correct_option correctOption , attempts , correct_answers correctAnswers
                from question 
                inner join test_quest 
                on test_quest.quest_id = question.id 
                inner join series_test
                on series_test.test_id = test_quest.test_id
                inner join token
                on token.series_id = series_test.series_id 
                where series_test.series_id = ${seriesId} and test_quest.test_id = ${testId} and question.id = ${questId} and token.user_id = ${userId} ;`
                connection.query(queryString2 , (err2 , result2) => {
                    if(err2) 
                    {
                        console.log(err1) ; 
                        resp.statusCode = 500 ;
                        resp.send({
                            "errorFlag" : true ,
                            "msg" : "database error" ,
                        }) ; 
                        return;
                    }
                    else  //if first query is successfull
                    {
                        resp.statusCode = 200 ; 
                        resp.send(result2[0]) ; 
                        return ;
                    }}) //end of connection.query2()
                    connection.end() ; 
            } 
        }
    }) //end of connection.query1()

    
})


//core logic method 
//myseries/submittest/${seriesId}/${testId}
mySeriesRouter.post("/submittest/:seriesId/:testId/", (req, resp) => {
    var userId ; 
    try{
    userId =  req.decoded.userId ; 
    }
    catch{
        console.log(logTime+": Error code 205") ; 
        resp.status(400).json({
            "errorFlag" : true ,
            "msg" : "Error code 205 , Please contact support team" ,
        })
    }
    var {testId , seriesId }= req.params ;
    var allAnswers = req.body ;  
    var connection =  mysql.createConnection(dbConfig) ;
    connection.connect() ; 
    var queryString1 = `select count(*) attemptCount from analysis where user_id = ${userId} and series_id = ${seriesId} and test_id = ${testId} ;`
    connection.query(queryString1 , (err1 , result1) => {
        if(err1) 
        {
            console.log(err1) ; 
            resp.statusCode = 500 ;
            resp.send({
                "errorFlag" : true ,
                "msg" : "database error" ,
            }) ; 
            connection.end() ; 
            return;
        }
        else  //if first query is successfull
        {
                        
            if(parseInt(result1[0].attemptCount) >= 2 )
            {
                    resp.status(400)
                    .json({
                        "errorFlag" : true ,
                        "msg" : "You can not proceed further ! Contact supports team !!" ,
                        }) ;
                     connection.end() ;  
            return ;    
            }  
            else{ 
                var queryString2 =  `select question.id questId , question.correct_option correctOption , subject.id subjectId , subject.name subjectName 
                from question 
                inner join subject 
                on question.subject_id = subject.id 
                inner join test_quest 
                on  test_quest.quest_id = question.id
                inner join series_test 
                on  series_test.test_id = test_quest.test_id
                inner join token 
                on token.series_id = series_test.series_id 
                where test_quest.test_id = ${testId} and series_test.series_id = ${seriesId} and user_id = ${userId}   
                order by question.id ;`
                connection.query(queryString2 , (err2 , result2) => {
                        if(err2) 
                        {
                            resp.statusCode = 500 ;
                            resp.send({
                                "errorFlag" : true ,
                                "msg" : "database error" ,
                            }) ; 
                            connection.end() ;
                        }
                        else 
                        {
                        
                            var correctQuestions  = []; 
                            var attemptedQuestionIds = [] ; 
                            var testResult = [] ; 
                            var subjectWiseAnalysis = {} ;
                            var subjectWiseAnalysisArray = [] ; 
                            //testResult will store the 1 , 0 , -1 , -2
                            //1 represent answer is correct 
                            //0 represent answer is wrong 
                            //-1 represent question is visited but not attempted 
                            //-2 represent question is not visited
                            //as we have used order by clause in every query
                            //we no need to store questionIds again in testResult because we can match them using array indexes  
                            //core Logic loop
                            for(var i = 0 ; i < allAnswers.length ; i++){
                                var {subjectName , subjectId } = result2[i] ;   
                                if(allAnswers[i].userAnswer != -1 && allAnswers[i].userAnswer != -2 )
                                attemptedQuestionIds.push(allAnswers[i].questId) ;
                                if(!subjectWiseAnalysis[`${subjectId}`]){
                                    subjectWiseAnalysis[`${subjectId}`] = {
                                        subjectName :  subjectName ,
                                        numberOfQuestions : 0 ,
                                        numberOfCorrectAnswers : 0 ,
                                        unanswerdQuestion : 0
                                    }
                                }
                                subjectWiseAnalysis[`${subjectId}`].numberOfQuestions ++ ; 
                                if(allAnswers[i].userAnswer == result2[i].correctOption)
                                {
                                    //if user answer is correct then come to this block
                                    correctQuestions.push(allAnswers[i].questId) ;
                                    testResult[i] = 1 ;                      
                                    subjectWiseAnalysis[`${subjectId}`].numberOfCorrectAnswers++ ;
                                }
                                else {
                                    if(allAnswers[i].userAnswer == -1 || allAnswers[i].userAnswer == -2 ){
                                        testResult[i] = allAnswers[i].userAnswer ;  
                                        subjectWiseAnalysis[`${subjectId}`].unanswerdQuestion++ ;
                                    }
                                    else
                                    testResult[i] = 0 ;
                                }
                            }//end of core logic loop

                            subjectWiseAnalysisArray = Object.keys(subjectWiseAnalysis)
                            .map((subjectId) => {
                                return ({subjectId : subjectId ,
                                    subjectName : subjectWiseAnalysis[`${subjectId}`].subjectName ,
                                    numberOfCorrectAnswers : subjectWiseAnalysis[`${subjectId}`].numberOfCorrectAnswers  ,
                                    numberOfQuestions : subjectWiseAnalysis[`${subjectId}`].numberOfQuestions ,
                                    unanswerdQuestion : subjectWiseAnalysis[`${subjectId}`].unanswerdQuestion
                                })   // end of return 
                                } )//end of map callback function

                            if(attemptedQuestionIds.length > 0){
                                var attemptedQuestionIdsString =  attemptedQuestionIds.join(" , ") ;
                                var queryString2 =  `update question set attempts = attempts + 1 where id in ( ${attemptedQuestionIds} );`
                                connection.query(queryString2) ;
                            }
                            if(correctQuestions.length > 0){
                                var correctQuestionsString =  correctQuestions.join(" , ") ;
                                var queryString3 =  `update question set correct_answers = correct_answers + 1 where id in ( ${correctQuestionsString} );`
                                connection.query(queryString3) ; 
                            }
                            var queryString4 =  `insert into analysis (user_id , series_id , test_id , correct_answers , total_questions , exam_date , attempted ) values ( ${userId} , ${seriesId} , ${testId} , ${correctQuestions.length} , ${allAnswers.length}, now() , ${attemptedQuestionIds.length});`
                            connection.query(queryString4) ;
                            connection.end() ;
                            resp.send({
                                testResult : testResult ,
                                subjectWiseAnalysisArray : subjectWiseAnalysisArray 
                            });
                        }
        })  //end of connection.query() query2
        }}
        })//end of connection.query1() 
})
module.exports =  mySeriesRouter ;  
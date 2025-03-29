const config = require("config");
const dbConfig = config.get("dbConfig") ; 
const express = require("express");
const mysql = require("mysql");

var freeSeriesRouter =  express.Router() ;
//get information about free test series 
//series id 1 always reprents free test series 
freeSeriesRouter.get("/" , (req , resp) => {
    var connection = mysql.createConnection(dbConfig) ;
    connection.connect() ; 
    var queryString =  `select * from series where id = 1 ; `
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
            resp.statusCode = 200 ;
            resp.send(result[0]) ; 
            return ; 
        }
    }) //end of connection.query() 
    connection.end() ;

}) ;//end of get request /freeseries


//get list of all the tests available in free test series
freeSeriesRouter.get("/tests" , (req , resp) => {
    var connection = mysql.createConnection(dbConfig) ;
    connection.connect() ; 
    //series id 1 always reprents free test series 
    var queryString =  `select series_test.test_id testId , test.name , test.description , test.duration ,test.marks_per_question marksPerQuestion from series_test inner join test on test.id = series_test.test_id where series_test.series_id = 1 order by series_test.test_id ;`
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
}) ;//end of get request /freeseries

//get list of all the question ids  in free test 
freeSeriesRouter.get("/:testId" , (req , resp) => {
    var testId = req.params.testId ;
    var connection = mysql.createConnection(dbConfig) ;
    connection.connect() ; 
    //series id 1 always reprents free test series 
    var queryString =  `select test_quest.quest_id from test_quest inner join series_test on series_test.test_id = test_quest.test_id where series_test.series_id = 1 and test_quest.test_id = ${testId};`
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

}) ;//end of get request /freeseries


//example url : /freeseries/questdata/10
freeSeriesRouter.get("/questdata/:questId", (req, resp) => {
    var {questId}  =  req.params  ;
    var connection = mysql.createConnection(dbConfig) ;
    connection.connect() ;  
    var queryString =  `select question.id , question.question , question.o1 , question.o2 , question.o3 , question.o4 , question.imageName from question inner join test_quest on test_quest.quest_id = question.id inner join series_test on series_test.test_id = test_quest.test_id where series_test.series_id = 1 and question.id = ${questId} ;`
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
            resp.statusCode = 200 ; 
            resp.send(result[0]) ; 
            return ; 
        }
    }) //end of connection.query() 
    connection.end() ; 
})


//example url : /freeseries/analysis/10
freeSeriesRouter.get("/analysis/:questId", (req, resp) => {
    var {questId}  =  req.params  ;
    var connection = mysql.createConnection(dbConfig) ;
    connection.connect() ;  
    var queryString =  `select question.id , question.question , question.o1 , question.o2 , question.o3 , question.o4 , question.imageName , correct_option correctOption , attempts , correct_answers correctAnswers from question inner join test_quest on test_quest.quest_id = question.id inner join series_test on series_test.test_id = test_quest.test_id where series_test.series_id = 1 and question.id = ${questId} ;`
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
            resp.statusCode = 200 ; 
            resp.send(result[0]) ; 
            return ; 
        }
    }) //end of connection.query() 
    connection.end() ; 
})

//core logic method 
freeSeriesRouter.post("/submittest/:testId/", (req, resp) => {
    var testId = req.params.testId ; 
    var allAnswers = req.body ;  
    var connection =  mysql.createConnection(dbConfig) ;
    connection.connect() ; 
    var queryString1 =  `select question.id questId , question.correct_option correctOption , subject.id subjectId , subject.name subjectName from question inner join subject on question.subject_id = subject.id inner join test_quest on  test_quest.quest_id = question.id where test_quest.test_id = ${testId} order by question.id ;`
    connection.query(queryString1 , (err , result) => {
        if(err) 
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
                var {subjectName , subjectId } = result[i] ;   
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

                if(allAnswers[i].userAnswer == result[i].correctOption)
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
            resp.send({
                testResult : testResult ,
                subjectWiseAnalysisArray : subjectWiseAnalysisArray 
            });
            connection.end() ;
        }
    })//end of connection.query() query1
})
module.exports =  freeSeriesRouter ;  
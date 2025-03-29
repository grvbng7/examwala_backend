1 ---> database errors 

2 ---> data validation or logical errors

3 ---> third party libraries errors 

---

101 ---> signuprequest checking cout(*) database error

102 ---> error while inserting data in otp table. (most probable cause : user already previously generated otp and not varified it , solution : admin has to delete previous entry or tell the user to otp manually checking in database) ; /otpvalidation

103 ---> error in select * from otp_validation ; 

104 ---> error in insert into user , see verifyOtp api and logs 

105 ---> error in selecting information of all the series currently active "/f/allseriesdata"

106 ---> error in select info of specific series. 

107 ---> error in selecting info of all tests of specific series

108 ---> "/myseries" call error

---

201 ---> user with given email or mobile already exists in database  and user again tried to register with same email or mobile   

202 ---> Wrong otp entered by user while account creation

203 ---> in "/myseries" call --> Unable to parse userId from token provided by user 

204 ---> in "/myseries/:seriesId/tests" call --> Unable to parse userId from token provided by user  

205 ----> in "myseries/:seriesId/:testId/:questId" --> Unable to parse userId from token provided by user

301 ---> unable to send otp email for user registration , please check logs for more details

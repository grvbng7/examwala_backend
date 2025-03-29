drop database exam_wala ; 
create database if not exists exam_wala  ; 
use exam_wala ; 
create table user (id int primary key auto_increment , fname varchar(20) , lname varchar(20) , email varchar(50) unique, mobile char(10) unique , password varchar(20)) ;
insert into user(fname , lname , email , mobile , password ) values ( 'Gaurav' , 'Bang' , 'grvbng7@proton.me' , '9087654321' , 'sunbeam' ) ; 

create table subject (id int primary key auto_increment, name varchar(20) ) ; 
insert into subject (name) values ('भूगोल') ,('इतिहास') , ('राज्यशास्त्र') , ('मराठी') ,('इंग्रजी') ,('कायदे') ,('संगणक') , ('चालू घडामोडी') ;
  
create table question (id int primary key auto_increment , question varchar(1000) , o1 varchar(500) , o2 varchar(500) , o3 varchar(500) , o4 varchar(500) , correct_option int , subject_id int , attempts int , correct_answers int , foreign key (subject_id) references subject(id) , imageName varchar(25) );   

insert into question (question , o1 , o2 , o3 , o4 ,  correct_option , subject_id , attempts , correct_answers ) values 
('य् , व्  , र , ल    यांची उगमस्थाने  अनुक्रमे _ _ _ _ _ या स्वरांच्या उच्चारस्थांनांसारखी आहेत.' , 'इ  , ऊ  , ॠ , लृ' , 'ई  , ऊ  , ॠ , लृ' , 'इ  , उ   , ॠ , लृ' , 'ई  , उ   , ॠ , लृ' , 3 , 4 , 20 , 18 ) ;

insert into question (question , o1 , o2 , o3 , o4 ,  correct_option , subject_id , attempts , correct_answers ) values 
('जेव्हा दोन वर्णांची संधी होऊन पहिला वर्ण व्यंजन असतो त्या संधीस _____ म्हणतात. 
(अ) स्वर संधी (ब) व्यंजन संधी (क) हल संधी (ड ) अच संधी ' , 'फक्त अ व  ब  बरोबर' , 'फक्त ब आणि क बरोबर' , 'फक्त ड  बरोबर' , 'फक्त ब बरोबर' , 2 , 4 , 20 , 18 ) ;

insert into question (question , o1 , o2 , o3 , o4 ,  correct_option , subject_id , attempts , correct_answers ) values 
('हा, ही, हे, तो, ती, ते यांना मराठी  व्याकरणात _____ म्हणतात.' , 'संबंधी सर्वनामे' , 'दर्शक सर्वनामे' , 'अनिश्चित सर्वनामे' , 'सामान्य सर्वनामे' , 2 , 4 , 19 , 15 ) ; 

insert into question (question , o1 , o2 , o3 , o4 ,  correct_option , subject_id , attempts , correct_answers ) values 
('"त्याला बिचाऱ्याला" हे उदाहरण कोणत्या विशेषणाचा प्रकार आहे.' , 'संख्या विशेषण' , 'संबंधी विशेषण' , 'सर्वनामिक विशेषण' , 'अधि -विधी विशेषण' , 3 , 4 , 20 , 16 ) ;


insert into question (question , o1 , o2 , o3 , o4 ,  correct_option , subject_id , attempts , correct_answers ) values 
('"एका हाताने टाळी वाजत नाही" या वाक्यातील "नाही" या क्रियापदास काय म्हणतात.' , 'अनियमित क्रियापद' , 'शक्य क्रियापद' , 'प्रायोजक क्रियापद' , 'सिद्ध क्रियापद' , 1 , 4 , 20 , 13 ) ;

insert into question (question , o1 , o2 , o3 , o4 ,  correct_option , subject_id , attempts , correct_answers ) values 
('(अ) ज्या प्रयोगात क्रियापद स्वतंत्र , एकवचनी , तृतीयपुरुषी , नपुसकलिंगी असते तेव्हा भावे प्रयोग होतो. 
(ब) भावकर्तरी  प्रयोगात कर्ताही नसतो आणि कर्मही नसते. 
(क) भावे प्रयोग सर्व काळात होतो.' , 'सर्व बरोबर' , 'फक्त ब व  क बरोबर' , 'फक्त अ व  क बरोबर' , 'फक्त अ व ब बरोबर' , 4 , 4 , 20 , 16 ) ;

insert into question (question , o1 , o2 , o3 , o4 ,  correct_option , subject_id , attempts , correct_answers ) values 
('पुढे दिलेल्या पर्यायातून फार्शी +फार्शी असा समानार्थक शब्दाचा समास साधलेला अंशाभ्यस्त शब्द कोणता ?' , 'डावपेच' , 'कागदपत्र' , 'रितीरिवाज' , 'बाजारहाट' , 1 , 4 , 20 , 11 ) ;

insert into question (question , o1 , o2 , o3 , o4 ,  correct_option , subject_id , attempts , correct_answers ) values 
('संकेतार्थी वाक्य ओळखा.' , 'भारताने ऑलिम्पिक मध्ये चांगले यश मिळवले.' , 'मन लावून अभ्यास करा.' , 'नारायण नवा उद्योग सुरु करणार आहे.' , 'जर चांगला अभ्यास केला तर उत्तम यश मिळेल.' , 4 , 4 , 20 , 16 ) ;

insert into question (question , o1 , o2 , o3 , o4 ,  correct_option , subject_id , attempts , correct_answers ) values 
('वाक्यार्थाला बाधा न आणता रचनेत केलेला बदल म्हणजे ______' , 'वाक्यविन्यास' , 'वाक्यपरिवर्तन' , 'वाक्यसंश्लेषण' , 'अर्थपरिवर्तन' , 2 , 4 , 20 , 11 ) ;

insert into question (question , o1 , o2 , o3 , o4 ,  correct_option , subject_id , attempts , correct_answers ) values 
('अलंकार ओळखा
"सावळाच रंग तुझा पावसाळि नभापरि !!!"' , 'उपमा अलंकार' , 'श्लेष अलंकार' , 'यमक अलंकार' , 'अतिशयोक्ती अलंकार' , 1 , 4 , 20 , 19 ) ;

insert into question (question , o1 , o2 , o3 , o4 ,  correct_option , subject_id , attempts , correct_answers ) values 
('This is the _______ scenery I have ever seen in my life' , 'beautiful' , 'the most beautiful' , 'most beautiful' , 'more beautiful' , 3 , 5 , 20 , 19 ) ;

insert into question (question , o1 , o2 , o3 , o4 ,  correct_option , subject_id , attempts , correct_answers ) values 
('The fog will disappear as soon as the sun rises.
Identify the type of the sentence' , 'simple' , 'compound' , 'complex' , 'complex-compound' , 3 , 5 , 20 , 16 ) ;

insert into question (question , o1 , o2 , o3 , o4 ,  correct_option , subject_id , attempts , correct_answers ) values 
('If I _____ late , my boss will fire me' , 'I was' , 'I become' , 'I fall' , 'I am' , 4 , 5 , 20 , 16 ) ;

insert into question (question , o1 , o2 , o3 , o4 ,  correct_option , subject_id , attempts , correct_answers ) values 
('Plutocrasy is ________' , 'Government by the rich' , 'Government by the nobles' , 'Government by the officials' , 'Government by the people' , 1 , 5 , 20 , 16 ) ;

insert into question (question , o1 , o2 , o3 , o4 ,  correct_option , subject_id , attempts , correct_answers ) values 
('An act of killing one''s own parent or parents' , 'Genocide' , 'Homicide' , 'Parricide' , 'Patricide' , 3 , 5 , 20 , 16 ) ;

insert into question (question , o1 , o2 , o3 , o4 ,  correct_option , subject_id , attempts , correct_answers ) values 
('भारतीय संरक्षण मंत्रालयाने "माया" नावाची नवीन operating system विकसित केली आहे.
खालीलपैकी कोणती लेअर (layer) या प्रणाली मध्ये malware attacks  पासून संगणकाचे संरक्षण करते ?' , 'मायाचक्षु' , 'स्वर्णकवच' , 'ब्रह्मास्त्र' , 'चक्रव्युह' , 4 , 8 , 20 , 16 ) ;

insert into question (question , o1 , o2 , o3 , o4 ,  correct_option , subject_id , attempts , correct_answers ) values 
('नुकतीच दिल्लीत अठरावी G२० परिषद पार पडली. या परिषदेची केंद्रीय संकल्पना काय होती ?' , 'सबका साथ सबका विकास.' , 'वसुधैव कुटुंबकं ।' , 'इंडिया ऍट ७५.' , 'G२० फॉर डेव्हलपमेंट इन २०थ सेंचुरी.' , 2 , 8 , 20 , 16 ) ;

insert into question (question , o1 , o2 , o3 , o4 ,  correct_option , subject_id , attempts , correct_answers ) values 
('डॉक्टर दिलीप महालनोबीस यांचे नुकतेच निधन झाले. 
त्यांच्या कोणत्या  महत्वपूर्ण योगदानासाठी ते ओळखले जातात?' , 'पोलीओ vaccine' , 'ORS (ओरल रेहायड्रेशन सोल्युशन )' , 'स्वस्त दरातील सॅनिटरी पॅड्स' , 'टीबी रुग्णांवर मोफत उपचार' , 2 , 8 , 20 , 16 ) ;

insert into question (question , o1 , o2 , o3 , o4 ,  correct_option , subject_id , attempts , correct_answers ) values 
('१९२७ साली बांधलेल्या आपल्या संसद इमारतीची मुख्य संकल्पना कशापासून प्रेरित झालेली आहे.' , 'सूर्यमंदिर' , 'व्हाईट हाऊस' , 'दिल्ली दरबार मुगल सल्तनत' , 'हिंदू योगिनी मंदिर' , 4 , 8 , 20 , 16 ) ;

insert into question (question , o1 , o2 , o3 , o4 ,  correct_option , subject_id , attempts , correct_answers ) values 
('कृत्रिम बुद्धिमत्ता आधारित चॅट जीपीटी सध्या बरेच चर्चेत असते. खालील पैकी कोणी ते विकसित केले आहे?
(अ) टेस्ला
(ब) ओपन Ai
(क) मायक्रोसॉफ्ट 
(ड) स्पॅसेक्स' , 'अ व ब बरोबर' , 'ब व क बरोबर' , 'ब व ड बरोबर' , 'यापैकी नाही' , 2 , 8 , 20 , 16 ) ;


create table test (id int primary key auto_increment , name  varchar(200) , description varchar(500) ,  launch_date date , duration time , marks_per_question double )  ; 
insert into test (  name , description , launch_date , duration , marks_per_question ) values ( 'free test 1' , 'it is a first free test' , now(), '00:20:00', 2.5 ) ; 
-- see how time datatype accepts values in term of 'HH:MM'

create table test_quest (test_id int , quest_id int , primary key(test_id , quest_id ) , foreign key (test_id) references test(id) , foreign key (quest_id) references question(id) ) ;

-- below is an important and interesting query : 
INSERT INTO test_quest (test_id, quest_id)
SELECT 1, id
FROM question ;

create table series (id int primary key auto_increment , name varchar(200) , details varchar(500) , launch_date date , price varchar(10) , d_price varchar(10) , active char(1) ) ; 
insert into series (name , details , launch_date , active , price ) values ('मोफत डेमो टेस्ट सिरीज क्रमांक १' , 'ही सिरीज विद्यार्थ्यांना एक्साम-वाला एप ची माहिती मिळावी आणि त्यांना आमच्या UI ची ओळख व्हावी या उद्देशाने बनवली आहे. 
सध्या यात फक्त एकच टेस्ट आहे.ज्यात २० प्रश्न आहेत. submit test केल्यानंतर विद्यार्थी त्यांचा performance report  पाहू शकतात.' , now() , 'Y' , 'free' ) ; 

create table series_test (series_id int , test_id int , primary key(series_id , test_id ), foreign key (series_id) references series(id) , foreign key (series_id) references series(id) ) ; 
insert into   series_test (series_id , test_id ) values ( 1 , 1 ) ;


create table token ( id int primary key auto_increment ,  user_id int , series_id int , sub_date date , foreign key (series_id) references series(id) , foreign key (user_id) references user(id) ) ;  

-- I have to add series id also , because we planned our app to work even if we include same test in multiple series 
create table analysis ( id int primary key auto_increment , user_id int , series_id int , test_id int ,  correct_answers int, attempted int , total_questions int , exam_date date  , foreign key (test_id) references test(id) , foreign key (user_id) references user(id) , foreign key (series_id) references series(id)) ;    

create table otp_validation ( id int primary key auto_increment , otp  int , fname varchar(20) , lname varchar(20) , email varchar(50) unique, mobile char(10) unique , password varchar(20)) ;

 
-- inserting paid questions 
insert into question (question , o1 , o2 , o3 , o4 ,  correct_option , subject_id , attempts , correct_answers ) values 
('paid question 1' ,'po1' , 'po2' , 'po3' , 'po4' , 3 , 1 , 20 , 18 ) ;
insert into question (question , o1 , o2 , o3 , o4 ,  correct_option , subject_id , attempts , correct_answers ) values 
('paid question 2' ,'po1' , 'po2' , 'po3' , 'po4' , 2 , 1 , 20 , 18 ) ;
insert into question (question , o1 , o2 , o3 , o4 ,  correct_option , subject_id , attempts , correct_answers ) values 
('paid question 3' ,'po1' , 'po2' , 'po3' , 'po4' , 4 , 1 , 20 , 18 ) ;
insert into question (question , o1 , o2 , o3 , o4 ,  correct_option , subject_id , attempts , correct_answers ) values 
('paid question 4' ,'po1' , 'po2' , 'po3' , 'po4' , 1 , 1 , 20 , 18 ) ;
insert into question (question , o1 , o2 , o3 , o4 ,  correct_option , subject_id , attempts , correct_answers ) values 
('paid question 5' ,'po1' , 'po2' , 'po3' , 'po4' , 2 , 1 , 20 , 18 ) ;
insert into question (question , o1 , o2 , o3 , o4 ,  correct_option , subject_id , attempts , correct_answers ) values 
('paid question 6' ,'po1' , 'po2' , 'po3' , 'po4' , 3 , 1 , 20 , 18 ) ;
insert into question (question , o1 , o2 , o3 , o4 ,  correct_option , subject_id , attempts , correct_answers ) values 
('paid question 7' ,'po1' , 'po2' , 'po3' , 'po4' , 3 , 1 , 20 , 18 ) ;
insert into question (question , o1 , o2 , o3 , o4 ,  correct_option , subject_id , attempts , correct_answers ) values 
('paid question 8' ,'po1' , 'po2' , 'po3' , 'po4' , 3 , 1 , 20 , 18 ) ;
insert into question (question , o1 , o2 , o3 , o4 ,  correct_option , subject_id , attempts , correct_answers ) values 
('paid question 9' ,'po1' , 'po2' , 'po3' , 'po4' , 3 , 1 , 20 , 18 ) ;
insert into question (question , o1 , o2 , o3 , o4 ,  correct_option , subject_id , attempts , correct_answers ) values 
('paid question 10' ,'po1' , 'po2' , 'po3' , 'po4' , 3 , 1 , 20 , 18 ) ;

  
-- creating test id 2 with question 21 to 25 and test id 3 with questions 26 to 30
insert into test (  name , description , launch_date ,  duration , marks_per_question ) values ( 'paid test 1' , 'it is a first paid test' , now() , '00:50:00' , 1 ) ;
insert into test (  name , description , launch_date ,  duration ,  marks_per_question) values ( 'paid test 2' , 'it is a second paid test' , now(), '01:30:00',  2 ) ;

INSERT INTO test_quest (test_id, quest_id)
SELECT 2, id
FROM question where id >= 21 and id <= 25 ;

INSERT INTO test_quest (test_id, quest_id)
SELECT 3, id
FROM question where id >= 26 and id <= 30 ;

-- creating first paid series 

insert into series (name , details , launch_date , active , price , d_price ) values ('Paid series 1' , 'description of paid series' , now() , 'Y' , '100' , '80' ) ; 
insert into series (name , details , launch_date , active , price , d_price ) values ('Paid series 2' , 'description of paid series' , now() , 'Y' , '120' , '90' ) ; 
insert into series (name , details , launch_date , active , price , d_price ) values ('Paid series 3' , 'description of paid series' , now() , 'Y' , NULL , '70' ) ; 
insert into series (name , details , launch_date , active , price , d_price ) values ('Paid series 4' , 'description of paid series' , now() , 'Y' , NULL , '80' ) ;
 
insert into   series_test (series_id , test_id ) values ( 2 , 2 ) , ( 2 , 3 ) ;
insert into   series_test (series_id , test_id ) values ( 3 , 2 ) , ( 3 , 3 )  ;
insert into   series_test (series_id , test_id ) values ( 4 , 2 )  ;
insert into   series_test (series_id , test_id ) values ( 5 , 2 ) , ( 5 , 3 ) ;

insert into token (user_id , series_id , sub_date) value ( 1 , 2 , now() ) , (1 , 4 , now()) ;  

insert into analysis (user_id , series_id , test_id , correct_answers , attempted ,  exam_date , total_questions ) values ( 1 , 2 , 2 , 3 , 5 , now() , 5 ) ; 
insert into analysis (user_id , series_id , test_id , correct_answers , attempted ,  exam_date , total_questions ) values ( 1 , 2 , 2 , 4 , 5 , now() , 5 ) ;
insert into analysis (user_id , series_id , test_id , correct_answers , attempted ,  exam_date , total_questions ) values ( 1 , 2 , 3 , 4 , 5 , now() , 5 ) ;














 



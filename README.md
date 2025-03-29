# Examwala Webapp Backend

When you clone this repository, please remember to add your email configurations in the `config/default.json` file. These configurations are necessary for sending emails from the backend, for example:  
- Sending OTPs during the signup process.  

Also, you can find `.sql` file in other_resources directory...  
`source` this file in your mysql database. 

## Tech Stack
- Frontend : React JS
- Backend : Node Js 
- Database : MySql

## Note
- I have created backend and frontend for user flows only.
- Code for admin ( who will manage users and upload exam series is currently pending )
- So currently, you need to add data to database manually .
- you can find frontend at : [examwala frontend](https://github.com/grvbng7/examwala_frontend)



## Areas for Improvement:
When I initially started developing this app, I was a student just beginning to learn web development. As a result, there are several areas where improvements can be made:

- Implementing a connection pool instead of using individual API calls for SQL connections.
- Utilizing `async` and `await` for dependent queries to simplify the code and reduce complexity.
- Ensuring proper resource management:
    - Closing database connections where necessary to prevent resource leakage.    
    - logging and monitoring 
    - input validation and sanitization
    - testing is pending 
    - API Documentation for easy development

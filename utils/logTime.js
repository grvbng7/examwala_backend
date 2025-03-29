function logTime(){
   return new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) ;
}

module.exports = logTime ; 
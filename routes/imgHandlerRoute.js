//my code works only if image name always ends with '.jpg'
const imgDir = require("config").get("imgDir");
const express = require("express"); 
const fs = require('fs') ; 
var imgHandler =  express.Router() ;


imgHandler.get("/:imgName", (req, resp)=> {
    const imgPath = imgDir+""+req.params.imgName+".jpg" ; 
try {    
    const imageBuffer = fs.readFileSync(imgPath);
    resp.end(imageBuffer, 'binary');
  } catch (error) {
    console.error('Error sending image:', error);
    resp.status(500).json({ error: 'Internal Server Error' });
  }
}) ; 
module.exports = imgHandler ; 
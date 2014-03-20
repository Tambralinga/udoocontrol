var sqlite3 = require('sqlite3').verbose();
var fs = require("fs");
var exists = fs.existsSync("udoo.db");
var db = new sqlite3.Database("udoo.db");

if(!exists) {
    db.run("CREATE TABLE Switches (sw_1 INT, sw_2 INT, sw_3 INT, p_9 INT)");
  }

if(exists) { 
 //db.prepare("INSERT INTO Switches (sw_1,sw_2,sw_3,p_9) VALUES (?,?,?,?)").run(1,0,1,20).finalize();
 /*
 l10st=0;
 l11st=0;
 l12st=1;
 p9st=22;
 db.prepare("UPDATE Switches SET sw_1='"+ l10st +"', sw_2='"+ l11st +"', sw_3='" + l12st + "', p_9='" + p9st +"' WHERE 1").run().finalize();
 */
 db.each("SELECT sw_1,sw_2,sw_3,p_9 FROM Switches", function(err, row) {
 console.log('Wert 1:' + row.sw_1 + ' Wert 2:' + row.sw_2 + ' Wert 3:' + row.sw_3 + ' Wert 4:' + row.p_9); });
 db.close();
 }
  

 	

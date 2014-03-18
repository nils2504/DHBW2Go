Parse.initialize("hDtpdjERu38kwQaINl0lXK5XEBEokQXXPYMt2SYH", "6UMsLO8HzwhZCOsRiD20PUh5uRGP9NN1SBQP4C87");
UserObj = Parse.Object.extend("User");
NewsObj = Parse.Object.extend("News");
ErrorObj = Parse.Object.extend("Errors");
var currentUser = Parse.User.current();
var localdb = window.openDatabase("dhbw", "1.0", "DHBW2Go", 1000000);
var userObjekt;

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

<!-- Initalize Device Ready Functions -->
app.onDeviceReady = new function(){
<!-- localdb.transaction(makeQueryUser,errorCB); -->
localdb.transaction(makeQueryUser);
}

<!-- Rest of Javascript - called by an event -->

$(document).ready(function() {
	
	$("#loginForm").on("submit", function(e) {
		e.preventDefault();
		$("#loginstatus").html("").removeClass("errorDiv");
		
		var user = $("#user").val();
		var password = $("#password").val();
		if($('#remember').attr("checked")){
			userObjekt[6] = 1;
			localdb.transaction(updateUser,errorCB);			
		}			
			
		var errors = "";
        if(user === "") errors += "Benutzername falsch.<br/>";
        if(password === "") errors += "Passwort falsch.<br/>";

        if(errors !== "") {
            $("#loginstatus").html(errors).addClass("errorDiv");
            return;
        }

        $("#loginstatus").html("<b>Logging in...</b>");
		Parse.User.logIn(user, password, {
            success:function(user) {              
                document.location.href='metroNav.html';
            },
            error:function(user, error) {
                console.log("ERROR!");
                console.dir(error);
                $("#loginstatus").html(error.message).addClass("errorDiv");
            }
        });
	 });
	$("#registerForm").on("submit", function(e) {
		e.preventDefault();
		var user = $("#user").val();
		var password = $("#password").val();
		var email = $("#mail").val();
		var kurs = $("#kurs option:selected").text();		
		var kal = $("#kurs option:selected").val();
		var stuv = false;
		if(email == "stuv@dhbw-loerrach.de"){
		stuv = true;
		}
		var newUser = new UserObj();
		newUser.set("username", user);
		newUser.set("password", password);
		newUser.set("email", email);
		newUser.set("class", kurs);
		newUser.set("cal", kal);
		newUser.set("stuv", stuv);
		 
		newUser.signUp(null, {
		success: function(newUser){
				localdb.transaction(populateDB,errorCB);
				doAlert("Erfolgreich registriert!", function() { document.location.href='index.html'; });
		},
		error: function(newUser, error) {
		alert("Error: " + error.code + " " + error.message);
		}
		});
		/*
		newUser.save(
				{
					username:user,
					password:password,
					email:email,
					class:kurs,
					cal:kal,
					stuv:stuv
				},{
					success:function(object) {						
						localdb.transaction(populateDB,errorCB);
						doAlert("Erfolgreich registriert!", function() { document.location.href='index.html'; });
						
					},
					error:function(model, error) {
						alert("Derzeit keine Registrierung m&ouml;lich - Internetverbindung &uuml;berpr&uuml;fen");
					}
				});*/
		
	   });
	$("#newsForm").on("submit", function(e) {
		e.preventDefault();
		
		var User = Parse.Object.extend("User");
		var query = new Parse.Query(User);
		query.equalTo("objectId", currentUser.id);
		query.find({
			success: function(results) {
				
					if(results[0].get('stuv')){
						var header = $("#header").val();
						var start = $("#start").val();
						var date = $("#date").val();
						var price = $("#price").val();
						var special = $("#special").val();
						var beschreibung = $("#beschreibung").val();
						
						var yf=date.split("-")[0];           
						var mf=date.split("-")[1];
						var df=date.split("-")[2];
						date = df+'.'+mf+'.'+yf;
						
						var newNews = new NewsObj();
						newNews.save(
								{
									header:header,
									start:start,
									date:date,
									price:price,
									special:special,
									beschreibung:beschreibung
								},{
									success:function(object) {
										console.log("Saved object");
										doAlert("Successful Logged In!", function() { document.location.href='success.html'; });
									},
									error:function(model, error) {
										console.log("Error Log In");
									}
								});
						}
						else{
							alert("Keine Berechtigung ein Event anzulegen");
							}
					},
					error: function(error) {
					}
				});
	 });
  
});		


function queryNews() {
var News = Parse.Object.extend("News");
var query = new Parse.Query(News);
query.find({
  success: function(results) {
  
	  
	  
    for (var i = 0; i < results.length; i++) {
      var object = results[i];

      var div = document.getElementById('newsContent');
      var newInf = document.createElement("DIV");
      var headLine = document.createElement("DIV");
      var body = document.createElement("DIV");
      var headerP = document.createElement("H3");
      var dateP = document.createElement("H4");
		      
      if(i%2 != 0){      
      	newInf.setAttribute("class", "event gray");
      }
      else{
      newInf.setAttribute("class", "event");
      }
      headLine.setAttribute("class", "headLine");
      body.setAttribute("class", "body");
      
      newInf.setAttribute("onclick", "queryNewsDetail('"+object.id+"')");
                
      var header = document.createTextNode(object.get('header'));
      var date = document.createTextNode(object.get('date'));
      var start = document.createTextNode('Einlass: '+object.get('start'));
      var price = document.createTextNode('Eintritt: '+object.get('price'));
      headerP.appendChild(header);
      dateP.appendChild(date);
      body.appendChild(start);
      body.appendChild(document.createElement("BR"));
      body.appendChild(price);
      
      headLine.appendChild(headerP);
      headLine.appendChild(dateP);
      
      newInf.appendChild(headLine);
      newInf.appendChild(body);
      div.appendChild(newInf);
    }
  },
  error: function(error) {
    alert("Error: " + error.code + " " + error.message);
  }
});
var User = Parse.Object.extend("User");
var query = new Parse.Query(User);
query.equalTo("objectId", currentUser.id);
query.find({
  		success: function(results) {			
			var u = results[0];
			if(u.get('stuv')){
			document.getElementById('eventAdd').style.display = "block";	
			}
		},
		error:function(model, error) {
		errorMsg.innerHTML = 'Passwort erfolgreich geÃ¤ndert';
		}
					
		
	});
}

function queryNewsDetail(x) {

var News = Parse.Object.extend("News");
var query = new Parse.Query(News);
query.equalTo("objectId", x);
query.find({
  success: function(results) {
  document.getElementById('newsContentDetail').style.display = 'block';
  document.getElementById('newsContentDetail').innerHTML = '';
  document.getElementById('newsContent').style.display = "none";
  document.getElementById('eventHBut').style.display = "block";
  
    for (var i = 0; i < results.length; i++) {
      var object = results[i];
      var div = document.getElementById('newsContentDetail');
      var beschr = document.createElement("DIV");
      var infos = document.createElement("DIV");
	  var head = document.getElementById('eventHtext');
	
      beschr.setAttribute("class", "beschr");
      infos.setAttribute("class", "infos gray");
      
      
      head.innerHTML = object.get('header')+' - Details';
      
      var beschrText = document.createTextNode(object.get('beschreibung'));
      var beschrH4 = document.createElement("H4");
      beschrH4.appendChild(document.createTextNode('Beschreibung'));
      beschr.appendChild(beschrH4);
      beschr.appendChild(beschrText);
      
      var infoH4 = document.createElement("H4");
      infoH4.appendChild(document.createTextNode('Informationen'));
      infos.appendChild(infoH4);
      infos.appendChild(document.createTextNode('Datum: '+object.get('date')));
      infos.appendChild(document.createElement("BR"));
      infos.appendChild(document.createTextNode('Einlass: '+object.get('start')));
      infos.appendChild(document.createElement("BR"));
      infos.appendChild(document.createTextNode('Eintritt: '+object.get('price')));
      infos.appendChild(document.createElement("BR"));
      infos.appendChild(document.createTextNode('Special: '+object.get('special')));
      
            
      div.appendChild(beschr);
      div.appendChild(infos);
    }
  },
  error: function(error) {
    alert("Error: " + error.code + " " + error.message);
  }
});
}

//Wrapper for alert so I can dynamically use PhoneGap alert's on device
function doAlert(str,cb) {
	if(cb) cb();
}

function loadProfil(){
	var User = Parse.Object.extend("User");
	var query = new Parse.Query(User);
	query.equalTo("objectId", Parse.User.current().id);
	query.find({
  		success: function(results) {			
			var u = results[0];
			var profil = document.getElementById("profilDiv");
			var p = document.createElement("H5");
			p.setAttribute('style','font-size:2em; line-height:44px;');
			
			
			p.appendChild(document.createTextNode('Username: '+u.getUsername()));
			p.appendChild(document.createElement("BR"));
			p.appendChild(document.createTextNode('Kurs: '+u.get('class')));
			p.appendChild(document.createElement("BR"));
			p.appendChild(document.createTextNode('E-Mail: '+u.get('email')));
			p.appendChild(document.createElement("BR"));
			var allowed = u.get('stuv');
			if(allowed){p.appendChild(document.createTextNode('Sie sind Stuv Mitglied'));
			p.appendChild(document.createElement("BR"));}
			p.appendChild(document.createElement("BR"));
			profil.appendChild(p);
			var rem = document.getElementById('changeRemember');
			if(userObjekt[6] == 1){
				rem.checked = true;		
			}
		
	},
  	error: function(error) {
    alert("Error: " + error.code + " " + error.message);
  }
  });
}
function changePw(){
	var user = currentUser.getUsername();
	
	var pwa = document.getElementById('pwa').value;
	var pwn = document.getElementById('pwn').value;
	var pwn2 = document.getElementById('pwn2').value;
	var errorMsg =document.getElementById('errorMsg');
				
	Parse.User.logIn(currentUser.getUsername(), pwa, {
            success:function(user) {	
				if(pwn == pwn2){  			
				currentUser.save(
				{
					password:pwn
				},{
					success:function(object) {
						errorMsg.innerHTML = 'Passwort erfolgreich geÃ¤ndert';
					},
					error:function(model, error) {
						errorMsg.innerHTML = 'Passwort erfolgreich geÃ¤ndert';
					}
				});
								
				}
				else{errorMsg.innerHTML = 'Die neuen PasswÃ¶rter stimmen nicht Ã¼berein'}
							
            },
            error:function(user, error) {
                errorMsg.innerHTML = 'Das alte Passwort ist inkorrekt';
            }
        });
	
}
function forgetPw(){
	 Parse.User.requestPasswordResetInBackground("nils.rhode04@gmail.com",
     new function() {alert("AHA");}
     );
}




function populateDB(tx) {
		tx.executeSql('DROP TABLE IF EXISTS user');	
	    tx.executeSql('CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, username VARCHAR(50), password VARCHAR(50), email VARCHAR(50), class VARCHAR(50), cal VARCHAR(50), stuv VARCHAR(50),remember BIT, objectid VARCHAR(50))');
		var email = $("#mail").val();
		var stuv = false;
		if(email == "stuv@dhbw-loerrach.de"){
		stuv = true;
		}		
	    tx.executeSql('INSERT INTO user (id, username, password, email, class, cal, stuv, remember, objectid) VALUES (1,"'+$("#user").val()+'","'+$("#password").val()+'","'+email+'","'+$("#kurs option:selected").text()+'","'+$("#kurs option:selected").val()+'","'+stuv+'",0,"'+currentUser.id+'")');
}
	
function errorCB(err) {
		  alert("Error processing SQL: "+err.code);
}
function updateUser(tx){
		tx.executeSql('UPDATE user SET username = "'+userObjekt[0]+'", password = "'+userObjekt[1]+'", email = "'+userObjekt[2]+'", class = "'+userObjekt[3]+'", cal = "'+userObjekt[4]+'", stuv = "'+userObjekt[5]+'", remember = '+userObjekt[6]+', objectid = "'+userObjekt[7]+'" WHERE id = 1');
}
function errorQB(err) {
		  alert("Error Query SQL: "+err.code);
}
				
function makeQueryUser(tx)
	{	
   		tx.executeSql('SELECT * FROM user',[], queryUserSucess);	
	}
function queryUserSucess(tx, results) {
	var len = results.rows.length;
	if(len == 1){
	userObjekt = new Array( results.rows.item(0).username,results.rows.item(0).password,results.rows.item(0).email,results.rows.item(0).class,results.rows.item(0).cal,results.rows.item(0).stuv,results.rows.item(0).remember,results.rows.item(0).objectid);
	}
}

function changeRemember(){
	if($('#changeRemember').attr("checked")){
			userObjekt[6] = 1;
			localdb.transaction(updateUser,errorCB);			
		}
		else{
			userObjekt[6] = 0;
			localdb.transaction(updateUser,errorCB);			
		}
	document.getElementById('errorMsg').innerHTML = "&Auml;nderungen &uuml;bernommen";
}

function out(){
	currentUser = '';
	userObjekt = '';
	Parse.User.logOut();
	userObjekt[6] = 0;
	localdb.transaction(updateUser);
	document.location.href = "index.html";
	
}
function rememberMe(){	
if(userObjekt[6] == 1){
	var User = Parse.Object.extend("User");
		currentUser.id = userObjekt[7];
		document.location.href = "metroNav.html";  
		
}
}
function downloadIcs(){
var fileTransfer = new FileTransfer();
alert("FileTransfer l&auml;uft");
var uri = encodeURI("https://webmail.dhbw-loerrach.de/owa/calendar/kal-wse11b@dhbw-loerrach.de/Kalender/calendar.ics");
var filepath="www/";
fileTransfer.download(
    uri,
    filePath,
    function(entry) {
        alert("download complete: " + entry.fullPath);
    },
    function(error) {
        alert("download error source " + error.source);
        alert("download error target " + error.target);
        alert("upload error code" + error.code);
    },
    false,
    {
        headers: {
            "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
        }
    }
);
}
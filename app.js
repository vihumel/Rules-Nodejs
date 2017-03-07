"use strict";
var nools = require("nools");
var express = require("express");
var bodyParser = require("body-parser");
var colors = require("colors");
var port = process.env.PORT || 3000;
var app = express();

app.use("/public",express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Se agregan las reglas
var flow = nools.compile(__dirname + "/rules/validate.nools"),
	  	Model = flow.getDefined("model");

//Endpoint
app.get("/departamento", function(getData, resData){

	//Se reciben los datos y cargagan en el modelo para enviarse a las reglas
	var dts = getData.query; 
	var models = [new Model(dts)];

	// Se crea la sesion y se pasan los datos a las reglas
	var session = flow.getSession.apply(flow, models);
		session.match().then(function () {

		resData.writeHead(200,{"content-type":"application/json"})
		
	    models.forEach(function (m) {
	        if (m.errors.length) {
	            console.log("%s \nerror : [ \n\t%s \n]", m, m.errors.join(",\n\t").red);
	            resData.end(JSON.stringify({success : false, descripcion: m.errors }));
	        } else {
	            console.log("%s is valid!".green, m);
	            resData.end(JSON.stringify({success : true, descripcion : "Los datos fueron validados correctamente."}));
	        }
	    });

	    session.dispose();
	}).addErrback(function (err) {
	    console.log(err.stack);
	});

});

//Se inicializa el endpoint
app.listen(port);
console.log("Server http://192.168.1.138:"+port+'/departamento');
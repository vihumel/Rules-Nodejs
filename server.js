var RuleEngine = require('node-rules');
var colors = require("colors");
var express = require("express");
var bodyParser = require("body-parser");
var port = process.env.PORT || 3000;
var app = express();

app.use("/public",express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get("/departamento", function(getData, resData){
	var dt = [];
	var rule = [{
		// Rule clave
		"name": "Clave valida",
		"priority": 4,
		"on": true,
	    "condition": function(R) {

	        R.when(this.clave && this.clave.length == 3);
	    },
	    "consequence": function(R) {
	        this.result = true;
	        dt.push({"clave": "valida"});
	        console.log("Clave Valida");
	        R.next();
	    }
		},{
			"name": "clave Invalida",
			"priority": 3,
			"on": true,
			"condition": function(R) {
		        R.when(this.clave && this.clave.length != 3);
		    },
		    "consequence": function(R) {
		        this.result = false;
		        dt.push({"clave": "invalida"});
		        console.log("Clave No Valida");
		        R.stop();
		    }
		},{
			"name": "Descripcion valida",
			"priority": 2,
			"on": true,
			"condition": function(R) {
		        R.when(this.descripcion.length < 141);
		    },
		    "consequence": function(R) {
		    	dt.push({"descripcion": "valida"});
		        this.result = true;
		        console.log("Descripcion valida");
		        R.next();
		    }
		},{
			"name": "Departamento Activo",
			"priority": 1,
			"on": true,
			"condition": function(R) {
		        R.when(this.activo == "true");
		    },
		    "consequence": function(R) {
		        this.result = true;
		        dt.push({"activo": "valida"});
		        console.log("Departamento activo");
		        R.stop();
		    }
	}];
	var R = new RuleEngine();
	R.register(rule);
	var fact = {
	    "clave": "dtsi",
	    "descripcion": "Departamento de ti",
	    "activo": "true"
	};
	console.log("--------------------------".blue);
	console.log("| start execute of rules |".blue);
	console.log("--------------------------".blue);
	R.execute(fact, function(result) {
		
	    console.log(dt);
	    
	});
	resData.writeHead(200,{"content-type":"application/json"})
	resData.write(JSON.stringify(dt));
	resData.end();
});



app.listen(port);
console.log("Server http://192.168.1.138 :" + port);
"use strict";
var nools = require("nools");

var flow = nools.compile(__dirname + "/rules/validate.nools"),
  	Model = flow.getDefined("model");

var models = [ 
  	new Model({clave : "DTI"}),
   	new Model({clave: "VER"}),
   	new Model({clave : "DTI", descripcion : "Departamento de TI"}),
   	new Model({clave : "DTI", descripcion : "Departamento de TI", activo : "true"})
];


var session = flow.getSession.apply(flow, models);
	session.match().then(function () {
    models.forEach(function (m) {
        if (m.errors.length) {
            console.log("%s \nerrors : [ \n\t%s \n]", m, m.errors.join(",\n\t"));
        } else {
            console.log("%s is valid!", m);
        }
    });
    session.dispose();
}).addErrback(function (err) {
    console.log(err.stack);
});

var dateFormat = require("dateformat");
var log4js = require('log4js');

module.exports.getKplogs = function(Servs){
	console.log('in kplogs')
	var date = new Date();

	var x = dateFormat(date, "mm-dd-yyyy");
	var fname = "C:/kpwsgloballogs/" + Servs + "/" + Servs + "-" + x + ".log";

	log4js.configure({
		appenders:{ logs: {type:"file", filename: fname }},
		categories:{default: {appenders:['logs'], level: 'all'}}
	});

	const logger = log4js.getLogger(Servs);
	return logger;
};

var fs = require('fs')
,ini = require('ini')
,mysql = require('mysql');

// var path = 'C:\\kpconfig\\globalConf.ini';
var path = '../../kpconfig/globalConf.ini';

module.exports = function (DBConfig)
{
var config = ini.parse(fs.readFileSync(path, 'utf-8'))
    ,iniFile = config[DBConfig]
    , con = mysql.createConnection({
        host:iniFile.Server,
        user: iniFile.UID,
        password: iniFile.Password,
        database: iniFile.Databse,
        pool : iniFile.Pool == '1' ? true:false,
        connectTimeout:parseInt(iniFile.Tout)
    });
return con;
}
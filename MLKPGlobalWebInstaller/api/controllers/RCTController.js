/**
 * RCTController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var dateFormat = require('dateformat');
var kplog = require('../configuration/kplogs')
var dbCon = require('../configuration/DBcon')
var download = require('download-file');
var path = require('path');
var mime = require('mime');
var fs = require('fs');
var conGlobal = '';
var usersglobal = 'DBConfig User';
logger = kplog.getKplogs("GlobalWebInstaller");
console.log('rct header');

module.exports = {

    index: function (req, res) {
        var userclass = req.session.userclass;
        var fullname = req.session.fullname;
        var zonecode = req.session.zonecode;
        var regioncode = req.session.regioncode;
        userlogin =  req.session.userlogin;
        console.log('rct index: '+ userlogin);

        var branchcode = [];
        var branchname = [];

        if(req.session.userclass === undefined && req.session.fullname === undefined){
            console.log('in session empty1');    
            return res.redirect('/');    
        }

        conGlobal = dbCon(usersglobal);
        conGlobal.query('SELECT branchcode, branchname FROM kpusersglobal.branches '
        + 'WHERE zonecode = ? AND regioncode =?',
        [zonecode, regioncode],
        function(err, result){
            if(err){
                logger.fatal("|Method: "+path.basename(__filename)+"|-Parameters: "+JSON.stringify(err));
            }else if(result.length != 0){
            let data = result;
                console.log('branchname = ' + data.branchname)
                console.log('branchcode = ' + data.branchcode)
                console.log('data = ' + JSON.stringify(data))
                console.log('in helpP');
                logger.info("|Method: "+path.basename(__filename)+"|-Parameters: "+JSON.stringify(data));
                return res.view('RCT/rctpage', {userclass, fullname, data : data});
            }
        })
     },

     branchManAndCode: function(req,res)  {
        var bbcode = req.query.branchcode;
         var userclass = req.session.userclass;
         var fullname = req.session.fullname;

         console.log('branchmanandcode userclass ' + userclass);
         console.log('branchmanandcode fullname' +  fullname);

        if(req.session.userclass === undefined && req.session.fullname === undefined){
            console.log('in session emptywe');    
            return res.redirect('/');    
        }

        console.log('in man and code queryzcode = ' + req.query.zonecode);
        console.log('in man and code sessionzcode = ' + req.session.zonecode);

        var bzcode = (req.query.zonecode === undefined) ? req.session.zonecode : req.query.zonecode;

        var retdata = '';
        var errret = '';
        console.log('bbcode = ' + bbcode)
        console.log('bzcode = ' + bzcode)
     

        conGlobal = '';

        conGlobal = dbCon(usersglobal);
        async.waterfall([function(cb){
        conGlobal.query('SELECT br.branchcode AS BCCode, br.branchname AS BName, b.fullname AS BMName, z.zonename AS zonename '
        + 'FROM kpusersglobal.branchusers b '
        + 'INNER JOIN kpusersglobal.sysuseraccounts s ON s.branchcode=b.branchcode AND s.zonecode=b.zonecode AND s.resourceid=b.resourceid '
        + 'INNER JOIN kpusersglobal.sysuserroles sr ON sr.resourceid=s.resourceid AND sr.zonecode=s.zonecode '
        + 'INNER JOIN kpusersglobal.branches br ON br.branchcode=b.branchcode AND br.zonecode=b.zonecode '
        + 'INNER JOIN kpusersglobal.zonecodes z ON br.zonecode= z.zonecode '
        + 'WHERE br.branchcode=? AND s.zonecode=? AND  sr.role=\'KP-BM\'', [bbcode, bzcode], 
        function(err, res){
        if(err){
            console.log(err);
            errret = {
                respcode : '0',
                message: 'Error'
            }
            logger.fatal("|Method: "+path.basename(__filename)+"|-Parameters: "+JSON.stringify(err));
            console.log(errret);
            cb(200);
            
        } else if (res.length != 0){
            retdata = {
                    BMname : res[0].BMName,
                    BName : res[0].BName,
                    BCCode : res[0].BCCode,
                    zonename : res[0].zonename
                }
            req.session.bmname = retdata.BMname;
            req.session.bname = retdata.BName;
            req.session.bcode = retdata.BCCode;
            req.session.zonename = retdata.zonename;
            console.log(retdata);
            logger.info("|Method: "+path.basename(__filename)+"|-Parameters: "+JSON.stringify(retdata));
            cb(null);
        } else{
            retdata = {
                respcode : '-0',
                message: 'Zone Code: ' + bbcode + ' doesn\'t belong to this Zone.'
            }
            logger.fatal("|Method: "+path.basename(__filename)+"|-Parameters: "+JSON.stringify(retdata));
            console.log(retdata);
            cb(null);
        }

        });
    }],function(err){
            if(err == 200){
                return res.json(errret);
            }else{
                return res.json(retdata);
            }
        })
   },

     validatePkey: function(req, res){
        if(req.session.userclass === undefined && req.session.fullname === undefined){
            console.log('in session empty2');    
            return res.redirect('/');    
        }
        console.log('in validatePKey');
        var resdata = '';
        var pkey = req.body.productkey;
        var bcode = req.body.branchcode;
        console.log('pkey = ' + pkey);
        console.log('branchcode = ' + bcode);
        conGlobal = '';
        conGlobal = dbCon(usersglobal);
        
        conGlobal.query('SELECT * FROM kpformsglobal.`sysproductkey` '
        + 'WHERE productkey = ? AND  branchcode = ?',[pkey, bcode],
        function(err,result){
            if(err){
                resdata = {
                    respcode : '-1',
                    message : err.toString()
                }
                logger.fatal("|Method: "+path.basename(__filename)+"|-Parameters: "+JSON.stringify(err));
            }else if(result.length != 0){
                resdata = {
                    respcode : '0',
                    message : 'Product Key is Valid'
                }
                logger.info("|Method: "+path.basename(__filename)+"|-Parameters: "+JSON.stringify(resdata));

            }else{
                resdata = {
                    respcode : '-2',
                    message : 'Product Key is Invalid'
                }
                logger.fatal("|Method: "+path.basename(__filename)+"|-Parameters: "+JSON.stringify(resdata));
            }
            return res.json(resdata);
        })
     },

     download: function(req, res){
        if(req.session.userclass === undefined && req.session.fullname === undefined){
            console.log('in session empty3');    
            return res.redirect('/');    
        }
        var path = req.session.filepath;
        var name = req.session.filename;
        
        console.log("in download");
        console.log(path);
        console.log(name);
        // req.session.destroy();
        res.download(path, name);
       
        // logger.info("|Method: "+path.basename(__filename)+"|-Parameters: "+JSON.stringify(res));
     },

     getFiletoDownload: function(req, res){
        if(req.session.userclass === undefined && req.session.fullname === undefined){
            console.log('in session empty4');    
            return res.redirect('/');    
        }
        var resdata = '';
        var filename = '';
        
        console.log('in download installer');
        var winType = req.query.winType;
        console.log('winType = '+ winType);
        console.log('dir = '+ __dirname);

        var urlWin32 = path.join(__dirname,'..','installers/32');
        var urlWin64 = path.join(__dirname,'..','installers/64');
        
        var download_url =  winType == 'Win32' ? urlWin32 : urlWin64;

        fs.readdir(download_url, function(err, items){
            if(err){
                console.log(err);
                resdata = {
                    respcode : '-1',
                    message : 'Error in Downloading!'
                }
                console.log('resdata = '+ resdata);
                return res.json(resdata);
                logger.fatal("|Method: "+path.basename(__filename)+"|-Parameters: "+JSON.stringify(err.toString()));
            }else{
                console.log(items.length);
                for (var i=0; i<items.length; i++) {
                    console.log(items[i].toString());
                }
               
                filename = items[0].toString();

                var mimetype = mime.lookup(download_url);
                download_url = download_url + "/" + filename;
                req.session.filename = filename;
                req.session.filepath = download_url;

                console.log('donwload_url ='+ download_url);
                console.log('filename ='+ filename);
                console.log('mimetype ='+ mimetype);

                // res.setHeader('Content-disposition', 'attachment; filename='+ filename);
                // res.setHeader('Content-type', mimetype);
                
                resdata = {
                    respcode : '0',
                    message : 'Success!'
                }
            }
            console.log('resdata = '+ resdata);
            return res.json(resdata);
        });
       
        }
    };

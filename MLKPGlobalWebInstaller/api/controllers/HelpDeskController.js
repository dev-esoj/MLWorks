/**
 * HelpDeskController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const async = require('async');
const Randomstring = require('randomstring');
var dateFormat = require("dateformat");
const dbCon = require('../configuration/DBcon');
var kplog = require('../configuration/kplogs')
var usersglobal = 'DBConfig User';
var conGlobal = '';
var rctdet = '';
var retbname = '';
var path = require('path');

logger = kplog.getKplogs("GlobalWebInstaller");

module.exports = {
    index: function (req, res) {        
        console.log('helpdesk controller!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        req.session.userClass = req.body.userclass;
        if(req.session.userclass === undefined && req.session.fullname === undefined){
            console.log('in session empty');    
            return res.redirect('/');    
        }
        var data = {
            link: '/HelpDesk', 
            userclass : req.session.userclass,
            fullname: req.session.fullname
        }
        return res.json(data);
        // res.view({userclass});
      },

    helpP: function(req,res)  {
        var userclass = req.session.userclass;
        var fullname = req.session.fullname;
        console.log(userclass);
        console.log(fullname);
        if(req.session.userclass === undefined && req.session.fullname === undefined){
            console.log('in session empty');    
            return res.redirect('/');    
        }
        console.log('in helpP');
        return res.view({userclass, fullname});    
        
        
    },

    branchList: function(req, res)  {
        var rct = req.query.rctID;
        if(req.session.userclass === undefined && req.session.fullname === undefined){
            console.log('in session empty');    
            return res.redirect('/');    
        }
        console.log('rctname =' + rct);
        conGlobal = dbCon(usersglobal);

        async.waterfall([function(cb){
            conGlobal.query('SELECT s.branchcode, s.zonecode, b.regioncode, bu.Fullname FROM kpusersglobal.sysuseraccounts s '
            + 'INNER JOIN kpusersglobal.branches b ON b.zonecode = s.zonecode AND b.branchcode = s.branchcode '
            + 'INNER JOIN kpusersglobal.branchusers bu ON s.resourceid = bu.resourceid '
            + 'WHERE s.UserLogin = ?',[rct],
            function(err, res){
                if(err){
                    logger.fatal("|Method: "+path.basename(__filename)+"|-Parameters: "+JSON.stringify(err));
                    cb(200)
                }else if(res.length != 0){
                    rctdet = {
                        branchcode: res[0].branchcode,
                        zonecode: res[0].zonecode,
                        fullname: res[0].Fullname,
                        regioncode: res[0].regioncode
                    }
                    req.session.zonecode = rctdet.zonecode;
                    console.log('session zone: '+ req.session.zonecode);
                    console.log(rctdet);
                    logger.info("|Method: "+path.basename(__filename)+"|-Parameters: "+JSON.stringify(rctdet));
                    cb(null)
                }
                
            })
        },function(cb){
            var zcode = rctdet.zonecode;
            var rcode = rctdet.regioncode;
            console.log('zcode = '+ zcode);
            console.log('rcode = '+ rcode);
            conGlobal.query('SELECT branchcode, branchname FROM kpusersglobal.branches WHERE zonecode = ? AND regioncode =?',
            [zcode, rcode],
            function(err, res){
                if(err){
                    logger.fatal("|Method: "+path.basename(__filename)+"|-Parameters: "+JSON.stringify(err));
                    cb(200);
                }else if(res.length != 0){
                    retbname = {
                        branch : res
                    }
                    console.log(retbname);
                    logger.info("|Method: "+path.basename(__filename)+"|-Parameters: "+JSON.stringify(retbname));
                    cb(null)
                }
            })
        }],function(err){
            if(err == 200){
                var retdata = {
                    respcode: '0',
                    message: 'Error.'
                }
                logger.fatal("|Method: "+path.basename(__filename)+"|-Parameters: "+JSON.stringify(err));
                return res.json(retdata);
            }else{
                var retdet = {
                    rctfname : rctdet.fullname,
                    branchdet : retbname.branch
                }
                console.log(retdet);
                logger.info("|Method: "+path.basename(__filename)+"|-Parameters: "+JSON.stringify(retdet));
                return res.json(retdet);
            }
        })
    },

    branchManAndCode: function(req,res)  {
        var bbcode = req.query.branchcode;

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

   getzonelist: function(req, res)  {
    if(req.session.userclass === undefined && req.session.fullname === undefined){
        console.log('in session empty');    
        return res.redirect('/');    
    }
    var zonedata = '';
    conGlobal = '';
    conGlobal = dbCon(usersglobal);
    console.log('in getzonelist');
    async.waterfall([function(cb){
        conGlobal.query('Select zonecode, zonename from kpusersglobal.zonecodes', 
        function(err, res){
            if(err){
                zonedata = {
                    respcode : '0',
                    message : 'error'
                }
                logger.fatal("|Method: "+path.basename(__filename)+"|-Parameters: "+JSON.stringify(err));
                cb(true)
            }else if(res.length != 0){
                zonedata = {
                zone : res
                }
                logger.info("|Method: "+path.basename(__filename)+"|-Parameters: "+JSON.stringify(zonedata));
                cb(null)
            }
        })
    }],function(err){
        if(err){
            throw err;
        }
        console.log(zonedata);
        return res.json(zonedata);
    });
},
generatePkey: function(req, res)  {
    if(req.session.userclass === undefined && req.session.fullname === undefined){
        console.log('in session empty');    
        return res.redirect('/');    
    }
    var bbcode = req.query.bbcode;

    var rand = Randomstring.generate(13);
     console.log(rand);
    var randString = bbcode +  rand;
    console.log(randString);
    var dateret = {
     randString : randString
    }
    return res.json(dateret);

},

viewexistingPkey: function(req, res)  {
    if(req.session.userclass === undefined && req.session.fullname === undefined){
        console.log('in session empty');    
        return res.redirect('/');    
    }
    var pkeydata = '';
    var zonename = req.query.zonename;
    var bcode = req.query.bcode;
    console.log('in viewexistingPkey');
    console.log('zonename = '+ zonename);
    console.log('bcode = '+ bcode);
    conGlobal = '';
    conGlobal = dbCon(usersglobal);
    async.waterfall([function(cb){
        conGlobal.query('SELECT productkey FROM kpformsglobal.sysproductkey WHERE branchcode=? AND zonecode=?',
        [bcode, zonename], 
        function(err, res){
            if(err){
                pkeydata = {
                    respcode : '0',
                    message : 'error'
                }
                logger.fatal("|Method: "+path.basename(__filename)+"|-Parameters: "+JSON.stringify(err));
                cb(200)
            }else if(res.length != 0){
                pkeydata = {
                pkey : res[0].productkey
                }
                logger.info("|Method: "+path.basename(__filename)+"|-Parameters: "+JSON.stringify(pkeydata));
                cb(null)
            }else{
                pkeydata = {
                    respcode : '-0',
                    message : 'No Existing Product Key for this Branch.'
                }
                logger.fatal("|Metho: "+path.basename(__filename)+"|-Parameters: "+JSON.stringify(pkeydata));
                cb(200)
            }
        })
    }],function(err){
        if(err == 200){
            console.log(pkeydata);
            return res.json(pkeydata);
        }else{
            console.log(pkeydata);
            return res.json(pkeydata);
        }
    });
},

SavePKey: function(req, res){
    if(req.session.userclass === undefined && req.session.fullname === undefined){
        console.log('in session empty');    
        return res.redirect('/');    
    }
    console.log('in save pkey');
    console.log('session pkey = ' + req.body.pkey);
    var errdet = '';
    var retdata = '';
    var bcode = req.session.bcode;
    var productkey = req.body.pkey;
    var zname = req.session.zonename;
    console.log('bcode = ' + bcode);
    console.log('zname = ' + zname);

    var serverdte = '';
    async.waterfall([function(cb){
        checkproductkey(bcode, zname, cb);
    },function(pkstatus, cb){
        console.log('pkstatus = '+ pkstatus)
        if(pkstatus == true){
            errdet = {
                respcode : '-1',
                message : 'Branch Already had a Product Key...'
            }
            logger.fatal("|Method: "+path.basename(__filename)+"|-Parameters: "+JSON.stringify(errdet));
            cb(true, errdet)
        }else{
            getServerDate(cb);
            
        }
    },function(serverdate, cb){
        console.log('insert function');
        let dte = serverdate;
        console.log(dte);
        console.log(productkey);
        var conGlobal = dbCon(usersglobal);
        conGlobal.query('SELECT * FROM kpformsglobal.sysproductkey WHERE branchcode = ?', [bcode],
        function(err, res){
            console.log(bcode);
            console.log('select if prodkey is exist :' +JSON.stringify(+res));
            if(err)
            {
                console.log(err);
                logger.fatal("|Method: "+path.basename(__filename)+"|-Parameters: "+JSON.stringify(err));
                cb(err)
            }
            else if (res.length == 0)
            {
                var conGlobal = dbCon(usersglobal);
                conGlobal.query('INSERT INTO kpformsglobal.sysproductkey (branchcode,productkey,syscreated,zonecode) '
                + 'VALUES (?,?,?,?)',[bcode, productkey, serverdate, zname], function(err, res){
                if(err){
                console.log(err);
                logger.fatal("|Method: "+path.basename(__filename)+"|-Parameters: "+JSON.stringify(err));
                cb(err)
                }else{
                console.log(res);
                retdata = {
                    respcode : '1',
                    message : 'Product Key Successfully Saved.'
                }
                logger.info("|Method: "+path.basename(__filename)+"|-Parameters: "+JSON.stringify(retdata));
                cb(null);
                }
                })
            }
            else{
                // console.log(err);
                retdata = {
                    respcode : '0',
                    message : 'Branch Already Have Existing Product Key.'
                }
                logger.fatal("|Method: "+path.basename(__filename)+"|-Parameters: "+JSON.stringify(err));
                cb(err)
            }
        })
        
    }],function(err){
        
        if(err == 200){
            console.log(errdet);
            return res.json(errdet);
        }else{
            console.log(retdata);
            return res.json(retdata);
        }
    })

}

};

function checkproductkey(bcode, zcode, cb){
    var retdte = '';
    conGlobal = '';
    console.log('in checkproductkey');
    console.log(bcode);
    console.log(zcode);
    conGlobal = dbCon(usersglobal);
    conGlobal.query('SELECT branchcode, zonecode '
    + 'FROM kpformsglobal.sysproductkey '
    + 'WHERE branchcode=? and zonecode=? ',[bcode,zcode],function(err, result){
        if(err){
        console.log('err' + err)
        logger.fatal("|Method: "+path.basename(__filename)+"|-Parameters: "+JSON.stringify(err));
        return res.serverError(err);
        }else if(retdte.length != 0){
            retdte = true;
            logger.info("|Method: "+path.basename(__filename)+"|-Parameters: "+JSON.stringify(retdte));
        }else{
            retdte = false;
            logger.fatal("|Method: "+path.basename(__filename)+"|-Parameters: "+JSON.stringify(retdte));
        }
        console.log('retdte = '+ retdte);
        cb(null, retdte);
    });
}

function getServerDate(cb){
    conGlobal = '';
    let retdte = '';
    console.log('in getserverdate');
    conGlobal = dbCon(usersglobal);
    conGlobal.query('Select Now() as dte', 
    function(err, result){
      if(err){
        console.log('err' + err)
        logger.fatal("|Method: "+path.basename(__filename)+"|-Parameters: "+JSON.stringify(err));
        return res.serverError(err);
      }else{
        // let retdte = result[0].dte;
        retdte = result[0].dte;
        // retdte = dateFormat(retdte);
        logger.info("|Method: "+path.basename(__filename)+"|-Parameters: "+JSON.stringify(retdte));

        console.log(retdte);
      }
     cb(null, retdte);
    });
  }

//   module.exports = getServerDate, checkproductkey;
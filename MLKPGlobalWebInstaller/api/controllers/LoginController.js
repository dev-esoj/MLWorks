/**
 * LoginController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var dateFormat = require('dateformat');
var path = require('path');
var async = require('async');
var dbCon = require('../configuration/DBcon')
var kplog = require('../configuration/kplogs')
var kindOfUser = '';
var data = '';
var conGlobal = '';
var usersglobal = 'DBConfig User';
var username = '';
var password = '';
var logger = '';
module.exports = {
  /**
   * `LoginController.login()`
   */
    login: function (req, res) {
    kindOfUser = '';
    username = '';
    password = '';
    
    username = req.body.uname;
    password = req.body.pass;
    
    logger = kplog.getKplogs("GlobalWebInstaller");
    logger.info("|Method: "+path.basename(__filename)+"|-Parameters: "+JSON.stringify(req.query));
    
    async.waterfall([
      function(cb){
        UserClassification(username, password, cb);
     // UserClassification(username,password, dbCon(usersglobal))
      // UserClassification(username, password, dbCon(usersglobal));
      // cb(null, userclass)
    },
    function(kindOfUser, cb){
      data ='';
      conGlobal = '';
      console.log(username);
      console.log(password);
      console.log('kindOfUser = '+ kindOfUser);
      console.log('waterfall2');
      conGlobal = dbCon(usersglobal);
      try{
        if(kindOfUser == 'KP-RCT'){
          conGlobal.query('SELECT b.fullname AS fullname, s.zonecode AS zonecode, sr.role AS task, br.branchname AS bcname, br.branchcode AS bccode, '
          + 'a.areaname AS AREA, b.resourceid AS ResID, s.UserLogin AS userlogin, a.areacode AS areacode, r.regioncode AS regioncode, r.regionname AS region, z.zonename AS zonename '
          + 'FROM kpusersglobal.sysuseraccounts s '
          + 'INNER JOIN kpusersglobal.branchusers b ON s.zonecode=b.zonecode AND s.resourceid=b.resourceid '
          + 'INNER JOIN kpusersglobal.sysuserroles sr ON sr.resourceid=s.resourceid AND sr.zonecode=s.zonecode '
          + 'INNER JOIN kpusersglobal.branches br ON br.branchcode=s.branchcode AND br.zonecode=s.zonecode '
          + 'INNER JOIN kpusersglobal.area a ON a.areacode=br.areacode AND a.zonecode=br.zonecode AND a.regioncode = br.regioncode '
          + 'INNER JOIN kpusersglobal.region r ON r.regioncode=br.regioncode AND r.zonecode=br.zonecode '
          + 'INNER JOIN kpusersglobal.zonecodes z ON z.zonecode=s.zonecode '
          + 'WHERE s.userlogin = ? AND s.userpassword = ? AND sr.role=?',
            [username , password, kindOfUser],
            function(err, res){
              console.log('ERROR: ' + err);
              console.log('SUCCESS: ' + res);
              if(err){
                console.log('error ni bai');
                logger.fatal("|Method: "+path.basename(__filename)+"|-Parameters: "+JSON.stringify(err));
                cb(200);
              }else if (res.length != 0){
                data = {
                  respcode : '1',
                  message : 'Success',
                  userclass : kindOfUser,
                  fullname : res[0].fullname,
                  zonecode : res[0].zonecode,
                  role : res[0].task, 
                  Branchname : res[0].bcname,
                  Branchcode : res[0].bccode,
                  areaname : res[0].area,
                  areacode : res[0].areacode,
                  regioncode : res[0].regioncode,
                  regionname : res[0].region,
                  zonename : res[0].zonename,
                  resourceid : res[0].ResID,
                  userzoneName : res[0].zonename,
                  userzoneCode : res[0].zonecode,
                  userlogin : res[0].userlogin
                  }
                  req.session.userclass = kindOfUser;
                  req.session.fullname = data.fullname;
                  req.session.Branchname = data.Branchname;
                  req.session.bCode = data.Branchcode;
                  req.session.zonecode = data.zonecode;
                  req.session.regioncode = data.regioncode;
                  req.session.resID = data.resourceid;
                  req.session.userlogin = data.userlogin;
                  // req.session.path = sails.getRouteFor("RCT");
                  //console.log('xxx' +req.session.path);
                  console.log('data =  ' + data);
                  
                  console.log('dota 212313213');
                  logger.info("|Method: "+path.basename(__filename)+"|-Parameters: "+JSON.stringify(data));
                  cb(null);
              }else{
                cb(201);
              }
          });
        }else if(kindOfUser == "KP-MISHELPDESK"){
          console.log(username);
          conGlobal = '';
          conGlobal = dbCon(usersglobal);
          conGlobal.query('SELECT s.IsActive,s.ResourceID, s.UserPassword, b.fullname, b.lastname,b.firstname,b.middlename, '
          + 'IF(CURRENT_TIMESTAMP >= s.StartDate AND CURRENT_TIMESTAMP <= s.EndDate ,s.TempBranchCode, s.BranchCode) '
          + 'AS curbranch, dep.departmentname, c.address AS address, s.zonecode, s.isresign, dep.DivisionCode,c.kp4code,c.VAT,c.FaxNo, c.Regioncode '
          + 'FROM kpusersglobal.sysuseraccounts s INNER JOIN kpusersglobal.adminusers b ON s.ResourceID = b.ResourceID AND s.ZoneCode = b.ZoneCode '
          + 'INNER JOIN kpusersglobal.branches c ON s.branchcode = c.branchcode AND s.ZoneCode = c.ZoneCode '
          + 'INNER JOIN kpusersglobal.department dep ON dep.DepartmentCode = b.DeptCode '
          + 'WHERE s.UserLogin = ?' , [username] , 
          function(err, res){
              console.log('ERROR: ' + err);
              console.log('SUCCESS: ' + res);
              if(err){
                console.log('error ni bai');
                
                logger.fatal("|Method: "+path.basename(__filename)+"|-Parameters: "+JSON.stringify(err));
                cb(200);
              }else if (res.length != 0){
                data = {
                  respcode : '1',
                  message : 'Success',
                  userclass : kindOfUser,
                  fullname : res[0].fullname,
                  zonecode : res[0].zonecode,
                  Branchcode: res[0].curbranch,
                  departmentname : res[0].departmentname, 
                  resourceid : res[0].ResourceID,
                  RegionCode : res[0].Regioncode,
                  }
                  req.session.resID = data.resourceid;
                  req.session.userclass = kindOfUser;
                  req.session.fullname = data.fullname;
                  req.session.bCode = data.Branchcode;
                  req.session.zonecode = data.zonecode;
                  req.session.regioncode = data.RegionCode,
                  req.session.departmentname = data.departmentname;
                  // req.session.path = res.redirect('RCT')
                  // console.log('xxx' +req.session.path);
                  console.log('data =  ' + data);
                  
                  logger.info("|Method: "+path.basename(__filename)+"|-Parameters: "+JSON.stringify(data));
                  cb(data);
              }else{
                cb(201);
              }
          });
        }
      }catch(err){
        console.log(err.stack);
      }
    }
  ],function(err){
    try{
    console.log(err);
        if(err == 201){
          var errdata = {
            respcode : '0',
            message : 'Invalid Crendentials'
          }
          logger.fatal("|Method: "+path.basename(__filename)+"|-Parameters: "+JSON.stringify(errdata));

          return res.view('Login/loginpage',{errdata : errdata.message})
        }
        else if (kindOfUser == 'KP-MISHELPDESK'){
          // console.log('succcesss ni HelpDesk')
          // var retdata = {
          //   link: '/Helpdesk',
          //   respcode : '1',
          //   userclass : kindOfUser,
          //   fname : req.session.fullname

          // }
          // return res.json(retdata);
          return res.redirect('HelpDesk');

        }else if (kindOfUser == 'KP-RCT'){
          console.log('succcesss ni RCT')
          // var retdata = {
          //   link: '/RCT',
          //   respcode : '1',
          //   userclass : kindOfUser,
          //   fname : req.session.fullname
          // }
          // return res.json(retdata);
          return res.redirect('RCT');
          console.log('redirected!')
          // res.send(data);        
        }
      }catch(err){
        console.log(err.stack);
      }
    });
  },
  /**
   * `LoginController.index()`
   */
  index: function(req,res){
    console.log('in index');
    var errdata = '';
    return res.view('Login/loginpage',{errdata : errdata})
  },
  /**
   * `LoginController.logout()`
   */
  logout: async function (req, res) {

      req.session.authenticated = false;
      req.session.destroy();
      res.redirect('/Login/index');
    // return res.json({
    //   todo: 'logout() is not implemented yet!'
    // });
  }
};
function UserClassification(username, password, cb){

  console.log(username);
  console.log(password);
  console.log('in waterfall');
  conGlobal = '';
  conGlobal = dbCon(usersglobal);

  try{
      conGlobal.query('SELECT a.Userlogin, a.ResourceID, b.Role FROM kpusersglobal.sysuseraccounts ' +
        'a INNER JOIN kpusersglobal.sysuserroles b ON a.ResourceID = b.ResourceID WHERE ' +
        'a.UserLogin = ? AND a.UserPassword = ?',
        [username, password], 
        function(err, result) {
            if(err) {
                console.log("err ni baii" +err);
                logger.fatal("|Method: "+path.basename(__filename)+"|-Parameters: "+JSON.stringify(err));
            }
            else if(result.length != 0) {
                kindOfUser = result[0].Role;
                
                logger.info("|Method: "+path.basename(__filename)+"|-Parameters: "+JSON.stringify(kindOfUser));
                console.log(kindOfUser);
            }else{
              
                err = 201;
            }
            cb(err, kindOfUser);
        });
      }catch(err){
          console.log(err.stack)
      }
  }


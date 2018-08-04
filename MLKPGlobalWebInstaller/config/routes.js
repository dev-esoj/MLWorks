/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {


  //  ╦ ╦╔═╗╔╗ ╔═╗╔═╗╔═╗╔═╗╔═╗
  //  ║║║║╣ ╠╩╗╠═╝╠═╣║ ╦║╣ ╚═╗
  //  ╚╩╝╚═╝╚═╝╩  ╩ ╩╚═╝╚═╝╚═╝

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/


 'get /' : {controller: 'Login', action:'index', view:'Login/loginpage'},
  
    


  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/

// LoginController
'post /Login' : {controller:'Login', action:'login', view: 'Login/loginpage'},
'get /Login/logout' : 'Login.logout',

// HelDeskController
'get /HelpDesk' :{ controller: 'HelpDesk', action: 'helpP', view: 'HelpDesk/helpdeskpage'},

'get /HelpDesk/branchList' :{ controller: 'HelpDesk', action: 'branchList', view: 'HelpDesk/helpdeskpage'},
'get /HelpDesk/branchManAndCode' :{ controller: 'HelpDesk', action: 'branchManAndCode', view: 'HelpDesk/helpdeskpage'},
'get /HelpDesk/generatePkey' :{ controller: 'HelpDesk', action: 'generatePkey', view: 'HelpDesk/helpdeskpage'},
'get /HelpDesk/getzonelist' :{ controller: 'HelpDesk', action: 'getzonelist', view: 'HelpDesk/viewproductkey'},
'get /HelpDesk/viewexistingPkey' :{ controller: 'HelpDesk', action: 'viewexistingPkey', view: 'HelpDesk/viewproductkey'},
'post /HelpDesk/SavePKey' :{ controller: 'HelpDesk', action: 'SavePKey', view: 'HelpDesk/helpdeskpage'},


// RCTController
'get /RCT' :{ controller: 'RCT', action: 'index', view: 'RCT/rctpage'},
'get /RCT/branchManAndCode' :{ controller: 'RCT', action: 'branchManAndCode', view: 'RCT/rctpage'},
'post /RCT/validatePkey' :{ controller: 'RCT', action: 'validatePkey', view: 'RCT/rctpage'},
'get /RCT/getFiletoDownload' :{ controller: 'RCT', action: 'getFiletoDownload', view: 'RCT/rctpage'},
'get /RCT/download' :{ controller: 'RCT', action: 'download', view: 'RCT/rctpage'},





  //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
  //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
  //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝



  //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
  //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
  //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝


  //  ╔╦╗╦╔═╗╔═╗
  //  ║║║║╚═╗║
  //  ╩ ╩╩╚═╝╚═╝


};

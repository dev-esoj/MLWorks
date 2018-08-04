using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MySql.Data.MySqlClient;

/// <summary>
/// Summary description for DbCon
/// </summary>
public class CustDbCon
{

private MySqlConnection DBCON;
    private String SERVER;
    private String DATABASE;
    private String UID;
    private String PASSWORD;
    private Boolean POOL = false;
    private int MAXCON = 100;
    private int MINCON = 0;
    private int TOUT = 30;

    public CustDbCon()
    {
    Initialize();
    }

    private void Initialize()
    {
        IniFile ini = new IniFile("C:\\kpconfig\\paynearmeConf.ini");

        SERVER = ini.IniReadValue("DBConfig PayNearMeLogs","Server");
        DATABASE = ini.IniReadValue("DBConfig PayNearMeLogs","Database");
        UID = ini.IniReadValue("DBConfig PayNearMeLogs","UID");
        PASSWORD = ini.IniReadValue("DBConfig PayNearMeLogs","Password");
        string a  = ini.IniReadValue("DBConfig PayNearMeLogs","Pool");

        if (a.Equals ("1"))
	    {
		 POOL = true;
	    }
        MAXCON = Convert.ToInt32(ini.IniReadValue("DBConfig PayNearMeLogs","MaxCon"));
        MINCON = Convert.ToInt32(ini.IniReadValue("DBConfig PayNearMeLogs","MinCon"));
        TOUT = Convert.ToInt32(ini.IniReadValue("DBConfig PayNearMeLogs","Tout"));

        String ConnString = "SERVER = " + SERVER + "; DATABASE = " + DATABASE + "; UID = " + UID + "; PASSWORD = " +PASSWORD+ "; Pooling = " + POOL + "; Min Pool Size =" + MINCON + "; Max Pool Size = " + MAXCON + "; Connection Lifetime =0;Command Timeout=28800; Connection Timeout= "+ TOUT +";";

        DBCON = new MySqlConnection(ConnString);
    }

    public bool CloseConnection()
    {
        try 
	    {	        
		    DBCON.Close();
                return true;
	    }
	    catch (Exception ex)
	    {
		    return false;
		    throw;
	    }
    }

     public MySqlConnection getConnection()
    {
        return DBCON;
    }

    public void dispose()
    {
        DBCON.Dispose();
    }
}

    




using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using log4net;
using MySql.Data.MySqlClient;
using System.Net.Mail;
using System.Net;
using System.Data;

// NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "Service" in code, svc and config file together.
public class Service : IService
{
	public string GetData(int value)
	{
		return string.Format("You entered: {0}", value);
	}

	public CompositeType GetDataUsingDataContract(CompositeType composite)
	{
		if (composite == null)
		{
			throw new ArgumentNullException("composite");
		}
		if (composite.BoolValue)
		{
			composite.StringValue += "Suffix";
		}
		return composite;
	}

    private static readonly ILog kplog = LogManager.GetLogger(typeof(Service));
    private DateTime sdt;
    private String loginuser = "boswebserviceusr";
    private String loginpass = "boyursa805";
    private string globalPath;
    private DBConnect dbcon;
  
    
    public SearchResponses sample()
    {
        return new SearchResponses { respcode = 0, respmsg = "Test!" };
    }


    public Service()
    {
        log4net.Config.XmlConfigurator.Configure();
        globalPath = "C:\\kpconfig\\globalConf.ini";

        IniFile iniGlobal = new IniFile(globalPath);

        Connect();

    }
    private void Connect()
    {
        //string path = httpcontext.current.server.mappath("boskpws.ini");
        IniFile ini = new IniFile(globalPath);

        String Serv = ini.IniReadValue("DBConfig Transaction", "server");
        String DB = ini.IniReadValue("DBConfig Transaction", "database");
        String UID = ini.IniReadValue("DBConfig Transaction", "uid");
        String Password = ini.IniReadValue("DBConfig Transaction", "password");
        String pool = ini.IniReadValue("DBConfig Transaction", "pool");
        Int32 maxcon = Convert.ToInt32(ini.IniReadValue("DBConfig Transaction", "maxcon"));
        Int32 mincon = Convert.ToInt32(ini.IniReadValue("DBConfig Transaction", "mincon"));
        Int32 tout = Convert.ToInt32(ini.IniReadValue("DBConfig Transaction", "tout"));
        dbcon = new DBConnect(Serv, DB, UID, Password, pool, maxcon, mincon, tout);
    }

    public SearchResponses EmailPinUpdate(String uEmail) 
    {
        try
        {
            using (MySqlConnection conGlobal = dbcon.getConnection())
            {
                try
                {
                    String dbEmail;
                    String dbMobileToken;
                    String rEmail = uEmail;

                    conGlobal.Open();

                    using (MySqlCommand cmd = conGlobal.CreateCommand())
                    {
                        int count = 0;
                        //string mm = rDate.ToString("MM");

                       // cmd.CommandText = "UPDATE `kpcustomersglobal`.`PayNearMe` SET PayNearMe.pinCodeStatus = '1', PayNearMe.retry='0' WHERE CustomerID IN (SELECT CustomerID FROM (SELECT* FROM `kpcustomersglobal`.`PayNearMe`) AS tablex WHERE tablex.UserID = '" + rEmail +"');";

                        cmd.CommandText = "SELECT * FROM `kpcustomersglobal`.`PayNearMe` WHERE UserID='"+ rEmail +"';";

                        using (MySqlDataReader rd = cmd.ExecuteReader())
                        {
                            rd.Read();
                            if (rd.HasRows)
                            {
                                //call method.

                                dbEmail = rd["UserID"].ToString();
                                dbMobileToken = rd["mobileToken"].ToString();
                                sendEmail(dbEmail, dbMobileToken);
                                rd.Close();
                                conGlobal.Close();
                                UpdateCustomerDB(dbEmail);

                                kplog.Info("SUCCESS: respcode: 1, message: " + getRespMessage(1) + " Number of Rows Updated: " + count );
                                return new SearchResponses { respcode = 1, respmsg = getRespMessage(1) };

                            }
                            else
                            {
                                rd.Close();
                                conGlobal.Close();
                                kplog.Info("INFO: respcode: 4, message: " + getRespMessage(4));
                                return new SearchResponses { respcode = 4, respmsg = getRespMessage(4) };

                            }
                            
                        }
                    }

                }
                catch (Exception ex)
                 {
                    conGlobal.Close();
                    kplog.Fatal("ERROR: respcode: 3, message: " + getRespMessage(3) + "Exception: " + ex );
                    return new SearchResponses { respcode = 3, respmsg = getRespMessage(3) };
                    throw;
                }
            }

        }
        catch (Exception ex)
        {

            kplog.Fatal("ERROR: respcode: 3, message: " + getRespMessage(3) + "Exception: " + ex);
            return new SearchResponses { respcode = 3, respmsg = getRespMessage(3) };
            throw;
        }
    }

    private void UpdateCustomerDB(string dbEmail) 
    {
        try
        {
            using (MySqlConnection conGlobal = dbcon.getConnection())
            {
                try
                {
                    conGlobal.Open();

                    using (MySqlCommand cmd = conGlobal.CreateCommand())
                    {
                        int count = 0;
                        //string mm = rDate.ToString("MM");

                        // cmd.CommandText = "UPDATE `kpcustomersglobal`.`PayNearMe` SET PayNearMe.pinCodeStatus = '1', PayNearMe.retry='0' WHERE CustomerID IN (SELECT CustomerID FROM (SELECT* FROM `kpcustomersglobal`.`PayNearMe`) AS tablex WHERE tablex.UserID = '" + rEmail +"');";

                        cmd.CommandText = "UPDATE `kpcustomersglobal`.`PayNearMe` SET pinCodeStatus = '1', retry = '0' WHERE `PayNearMe`.`UserID` = '" + dbEmail + "';";

                        count = cmd.ExecuteNonQuery();
                        conGlobal.Close();
                        kplog.Info("SUCCESS: respcode: 1, message: " + getRespMessage(1) + " Number of Rows Updated: " + count);
                        
                    }

                }
                catch (Exception ex)
                {
                    conGlobal.Open();
                    kplog.Fatal("ERROR: respcode: 3, message: " + getRespMessage(3) + "Exception: " + ex);
                    throw;
                }
            }

        }
        catch (Exception ex)
        {
            kplog.Fatal("ERROR: respcode: 3, message: " + getRespMessage(3) + "Exception: " + ex);
            throw;
        }
    }

    private void sendEmail(String Reciever, String Token)
    {
        string status = System.String.Empty;
        try
        {
            IniFile ini = new IniFile(globalPath);

            String Host = ini.IniReadValue("MLConfig PayNearMe", "Host");
            String Username = ini.IniReadValue("MLConfig PayNearMe", "Username");
            String Password = ini.IniReadValue("MLConfig PayNearMe", "Password");

            string from = Username;
            string password = Password;
            string host = Host;
            SmtpClient client = new SmtpClient();
            client.EnableSsl = true;
            client.Host = host;
            client.UseDefaultCredentials = false;
            client.Credentials = new NetworkCredential(from, password);
            client.DeliveryMethod = SmtpDeliveryMethod.Network;
            client.Port = 587;
            MailMessage msg = new MailMessage();
            msg.To.Add(Reciever);
            msg.From = new MailAddress(from);
            msg.Subject = "Request for PIN Reset";
            msg.Body = "Good day!<br /><br />We've received a request to reset your PIN. If you didn't make the request,<br />";
            msg.Body += "just ignore this email. Otherwise, you can use the PIN below:<br /><br />";
            msg.Body += "Mobile PIN: " + Token + "<br /><br />";
            msg.Body += "Thank you.";
            msg.IsBodyHtml = true;

            client.Send(msg);
            status = "success";
            kplog.Info("SUCCESS: respcode: 1, message: Email Sent.");
        }
        catch (Exception ex)
        {
            kplog.Fatal("ERROR: respcode: 15, message: " + getRespMessage(15) + "Exception: " + ex);
            throw;
        }
    }
    
    public SearchResponses manualUpdate(DateTime uDate)
    {
        //kplog.Info("Username: " + Username + ", Password: " + Password);
        //if (!authenticate(Username, Password))
        //{
        //    kplog.Error("FAILED:: respcode: 7 , message: Invalid Credentials!");
        //    return new SearchResponses { respcode = 0, respmsg = getRespMessage(7) };
        //}
        try
        {
            using (MySqlConnection conGlobal = dbcon.getConnection())
            {
                try
                {
                    DateTime rDate = uDate;

                    conGlobal.Open();

                    using (MySqlCommand cmd = conGlobal.CreateCommand())
                    {
                        int count = 0;
                        string mm = rDate.ToString("MM");
                        cmd.CommandText = "UPDATE `paynearme`.`order" + mm + "` SET order" + mm + ".`STATUS` = 'void' WHERE order" + mm + ".siteOrderIdentifier IN (SELECT siteOrderIdentifier FROM (SELECT * FROM `paynearme`.`order" + mm + "`) AS tablex WHERE tablex.orderDuration <  DATE_ADD('" + rDate.ToString("yyyy-MM-dd") + "', INTERVAL 1 DAY) AND tablex.`STATUS` = 'open');";
                        count = cmd.ExecuteNonQuery();

                        conGlobal.Close();
                        kplog.Info("SUCCESS: respcode: 1, message: " + getRespMessage(1) + " Number of Rows Updated: " + count );
                        return new SearchResponses { respcode = 1, respmsg = getRespMessage(1) };
                    }

                }
                catch (Exception ex)
                {
                    kplog.Fatal("ERROR: respcode: 3, message: " + getRespMessage(3) + "Exception: " +ex );
                    return new SearchResponses { respcode = 3, respmsg = getRespMessage(3) };
                    throw;
                }
            }

        }
        catch (Exception ex)
        {

            throw;
        }

    }

public SearchResponses tagVoidTransactions()
    { 
        try 
        {
            using (MySqlConnection conGlobal = dbcon.getConnection())
        {
            try 
	        {

                DateTime date = getServerDate();
                checkPromoCode(date.ToString("MM"));

                
                conGlobal.Open();
                using (MySqlCommand cmd = conGlobal.CreateCommand())
                {
                    int count = 0;
                    string mm;
                    string dd = date.ToString("dd");
                    DateTime mmDet;

                    if (dd == "01" || dd == "1")
                    {
                        mmDet = date.AddMonths(-1);
                        mm = mmDet.ToString("MM");
                    }
                    else
                    {
                        mm = date.ToString("MM");
                    }

                    cmd.CommandText = "UPDATE `paynearme`.`order" + mm + "` SET order" + mm + ".`status` = 'void' WHERE order" + mm + ".siteOrderIdentifier IN (SELECT siteOrderIdentifier FROM (SELECT * FROM `paynearme`.`order" + mm + "`) AS tablex WHERE tablex.orderDuration < NOW() AND tablex.`status` = 'open');";
                    count = cmd.ExecuteNonQuery();

                    conGlobal.Close();
                    kplog.Info("SUCCESS: respcode: 1, message: " + getRespMessage(1) + " Number of Rows Updated: " + count);
                    return new SearchResponses { respcode = 1, respmsg = getRespMessage(1) };
                } 
                	
	        }
	        catch (Exception ex)
	        {

                conGlobal.Close();
                kplog.Fatal("ERROR: respcode: 3, message: " + getRespMessage(3) + "Exception: " + ex);
                return new SearchResponses { respcode = 3, respmsg = getRespMessage(3) };
	        }
        }
		
	    }
	    catch (Exception ex)
	    {
		
		    throw;
	    }

    }


public class TimesUsed 
{
    public string CustID {get;set;}
    public string PromoCode{get;set;}

}

public SearchResponses checkPromoCode(string month)
    {
        int count;
        List<TimesUsed> list = new List<TimesUsed>();
       try
        {
            using (MySqlConnection conn = dbcon.getConnection())
            {
                conn.Open();
                using (MySqlCommand cmd = conn.CreateCommand())
                {
                    cmd.CommandText = "SELECT senderIdentifier, PromoCode FROM `paynearme`.`order" + month + "` WHERE `status` = 'open' AND OrderDuration < Now() AND PromoCode IS NOT NULL AND PromoCode != '';";
                    using (MySqlDataReader rd = cmd.ExecuteReader())
                    {
                        if (rd.HasRows)
                        {
                            while (rd.Read())
                            {
                                bool resultPRomoCode;
                                resultPRomoCode = String.IsNullOrWhiteSpace(rd["PromoCode"].ToString());
                                if (resultPRomoCode == false)
                                {
                                    list.Add(new TimesUsed { CustID = rd["senderIdentifier"].ToString(), PromoCode = rd["PromoCode"].ToString() });
                                }
                            }
                        }
                        rd.Close();
                        foreach (var item in list)
	                    {
                            string CustID = item.CustID;
                            string Promo = item.PromoCode;
                            cmd.CommandText = "SELECT * FROM `kpcustomersglobal`.`PNMPromocode` WHERE CustomerID = '" + CustID + "' AND PromoCode = '" + Promo + "';";
                            using (MySqlDataReader rd1 = cmd.ExecuteReader())
                            {
                                if (rd1.HasRows)
                                {
                                    rd1.Read();
                                    int tm = Convert.ToInt32(rd1["TimesUsed"]);
                                     tm = tm - 1;
                                     if (tm < 0)
                                     {
                                         tm = 0;
                                     }
                                    rd1.Close();
                                    
                                    cmd.CommandText = "UPDATE `kpcustomersglobal`.`PNMPromocode` SET TimesUsed = '"+ tm +"' WHERE CustomerID = '" + CustID + "' AND PromoCode = '" + Promo + "';";
                                    count = cmd.ExecuteNonQuery();
                                    kplog.Info("SUCCESS: respcode: 1, message: " + getRespMessage(1) + " Number of Rows Updated: " + count + "CustomerID = " + CustID + " PromoCode = " + Promo);
                                }

                                
                            }
                        }
                    }
                   
                }
                 conn.Close();
            return new SearchResponses { respcode = 1, respmsg = getRespMessage(1) };
            }
           
        }
        catch (Exception ex)
        {
            kplog.Fatal("ERROR: respcode: 3, message: " + getRespMessage(3) + "Exception: " + ex);
            return new SearchResponses { respcode = 3, respmsg = getRespMessage(3) };
        }


    }



    public DateTime getServerDate()
    {
        using (MySqlConnection conn = dbcon.getConnection())
        {
            conn.Open();
            using (MySqlCommand cmd = conn.CreateCommand())
            {
                DateTime svrDate;

                cmd.CommandText = "SELECT NOW() as svrDate;";

                using (MySqlDataReader rd = cmd.ExecuteReader())
                {
                    rd.Read();

                    svrDate = Convert.ToDateTime(rd["svrDate"]);
                    rd.Close();
                    conn.Close();
                    return svrDate ;
                }
                
            }
         }
    }

 public String getRespMessage(Int32 code)
    {
        String x = "SYSTEM_ERROR";
        switch (code)
        {
            case 1:
                return x = "Success";
            case 2:
                return x = "Duplicate kptn";
            case 3:
                return x = "Connection Error";
            case 4:
                return x = "Email not found";
            case 5:
                return x = "Customer not found";
            case 6:
                return x = "Customer already exist";
            case 7:
                return x = "Invalid credentials";
            case 8:
                return x = "KPTN already cancelled";
            case 9:
                return x = "Transaction is not yet claimed";
            case 10:
                return x = "Version does not match";
            case 11:
                return x = "Problem occured during saving. Please save the transaction again.";
            case 12:
                return x = "Problem saving transaction. Please close the sendout form and open it again. Thank you.";
            case 13:
                return x = "Invalid station number.";
            case 14:
                return x = "Error generating receipt number.";
            case 15:
                return x = "There was an Error occurec. Please see logs for details.";
            default:
                return x;
        }
    }

    private Boolean authenticate(String username, String password)
    {
        if (loginuser.Equals(username) && loginpass.Equals(password))
        {
            return true;
        }
        else
        {
            return false;
        }
    }



    public DateTime serverDate { get; set; }
}


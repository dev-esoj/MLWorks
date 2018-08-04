using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace PayNearMe_Order_Update.Utility
{
    public static class Logs
    {
        public static int filecount { get; set; }

        public static void makeFolder()
        {
            DirectoryInfo dir = new DirectoryInfo(@"C:\PayNearMe App Logs");
            try
            {
                if (dir.Exists)
                {
                    return;
                }
                dir.Create();
            }
            catch (Exception e)
            {
                MessageBox.Show("Message: " + e.Message);
            }
        }

        public static void makeLogs(string respcode, string respmsg, string datetoday)
        {
            string logPath = @"C:\PayNearMe App Logs\" + "Network_" + datetoday;
            FileStream fs;
            StreamWriter sw;

            if (File.Exists(logPath + "[" + filecount.ToString() + "].log"))
            {
                FileInfo fi = new FileInfo(logPath + "[" + filecount.ToString() + "].log");
                if (fi.Length > 4886413)
                {
                    filecount++;
                    try
                    {
                        fs = new FileStream(logPath + "[" + filecount.ToString() + "].log", FileMode.CreateNew, FileAccess.Write, FileShare.ReadWrite);
                    }
                    catch (Exception)
                    {
                        fs = new FileStream(logPath + "[" + filecount.ToString() + "].log", FileMode.Append, FileAccess.Write, FileShare.ReadWrite);
                        throw;
                    }
                }
                else
                {
                    fs = new FileStream(logPath + "[" + filecount.ToString() + "].log", FileMode.Append, FileAccess.Write, FileShare.ReadWrite);
                }
            }
            else
            {
                filecount = 1;
                fs = new FileStream(logPath + "[" + filecount.ToString() + "].log", FileMode.CreateNew, FileAccess.Write, FileShare.ReadWrite);
            }

            sw = new StreamWriter(fs);
            sw.BaseStream.Seek(0, SeekOrigin.End);

            sw.WriteLine(respcode + " " + respmsg + " " + DateTime.Now);
            sw.Close();
        }

        public static void makeLogs(string respcode, string respmsg, string datetoday, string tablename, string database)
        {
            string logPath = @"C:\PayNearMe App Logs\" + "Network_" + datetoday;
            FileStream fs;
            StreamWriter sw;

            if (File.Exists(logPath + "[" + filecount.ToString() + "].log"))
            {
                FileInfo fi = new FileInfo(logPath + "[" + filecount.ToString() + "].log");
                if (fi.Length > 4886413)
                {
                    filecount++;
                    try
                    {
                        fs = new FileStream(logPath + "[" + filecount.ToString() + "].log", FileMode.CreateNew, FileAccess.Write, FileShare.ReadWrite);
                    }
                    catch (Exception)
                    {
                        fs = new FileStream(logPath + "[" + filecount.ToString() + "].log", FileMode.Append, FileAccess.Write, FileShare.ReadWrite);
                        throw;
                    }
                }
                else
                {
                    fs = new FileStream(logPath + "[" + filecount.ToString() + "].log", FileMode.Append, FileAccess.Write, FileShare.ReadWrite);
                }
            }
            else
            {
                filecount = 1;
                fs = new FileStream(logPath + "[" + filecount.ToString() + "].log", FileMode.CreateNew, FileAccess.Write, FileShare.ReadWrite);
            }

            sw = new StreamWriter(fs);
            sw.BaseStream.Seek(0, SeekOrigin.End);
            if (respcode == "1")
            {

                sw.WriteLine("SUCCESS!:  Respcode: " + respcode + " | Message: " + respmsg + "| Date: " + DateTime.Now + "| Information: " + database + "." + tablename);
                sw.Close();
            }
            else
            {
                sw.WriteLine("FAILED!:  Respcode: " + respcode + " | Message: " + respmsg + "| Date: " + DateTime.Now + "| Information: " + database + "." + tablename);
                sw.Close();
            }

        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;
using System.Windows.Forms;
namespace Helper
{
    static class ReadIni
    {
        public static string fromINIFile()
        {
            string path = Application.StartupPath + @"\MLWebRemitAgent.ini";
            var ini = new IniFile.IniFile(path);
            string strURL = ini.IniReadValue("AgentURL", "URL");
            return strURL;
        }

        public static string fromINIFile(string MetadataMethodService, string ServiceMethodURL)
        {
            string path = Application.StartupPath + @"\MLWebRemitAgent.ini";

            var ini = new IniFile.IniFile(path);
            string strURL = ini.IniReadValue(MetadataMethodService, ServiceMethodURL);

            return strURL;
        }

        public static string fromINIFile(string ServiceMethodURL)
        {
            string path = Application.StartupPath + @"\MLWebRemitAgent.ini";
            FileInfo file = new FileInfo(path);
            StreamReader fileReader = file.OpenText();
            var configline = from line in fileReader.ReadToEnd().Split((Environment.NewLine).ToCharArray(), StringSplitOptions.RemoveEmptyEntries)
                             select line;
            foreach (var item in configline)
            {
                if (item.Contains(ServiceMethodURL + "="))
                {
                    return item.Substring(item.IndexOf('=') + 1);
                }
            }
            return null;
        }
    }
}

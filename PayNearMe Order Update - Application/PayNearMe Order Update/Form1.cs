using Helper;
using Newtonsoft.Json;
using PayNearMe_Order_Update.Utility;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Net.Security;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace PayNearMe_Order_Update
{
    public partial class frmAgent : Form
    {

        private Boolean isExtend;
        private Boolean isStarted;
        DateTime current = DateTime.Now;
        TimeSpan getTime;
        private Boolean isManualUpdate;
        private Boolean isResetPin;
        private String tme;
        
        System.Windows.Forms.Timer t = new System.Windows.Forms.Timer();
        double pbUnit;
        int pbWIDTH, pbHEIGHT, pbComplete;

        Bitmap bmp;
        Graphics g;

        public frmAgent()
        {
            InitializeComponent();
            ServicePointManager.ServerCertificateValidationCallback = new RemoteCertificateValidationCallback(delegate { return true; });
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            this.Size = new System.Drawing.Size(377, 154);
            Logs.makeFolder();
            Logs.filecount = 1;

            getUpdateTime();
            pbBoxConFig();
        }


        private void pbBoxConFig()
        {
            //get picboxPB dimension

            pbWIDTH = picboxPB.Width;
            pbHEIGHT = picboxPB.Height;

            //pbComplete - This is equal to work completed in % [min = 0 max = 100]
            pbComplete = 0;

            //create bitmap
            bmp = new Bitmap(pbWIDTH, pbHEIGHT);
            //timer
            t.Interval = 50;    //in millisecond
            t.Tick += new EventHandler(this.t_Tick);
            t.Start();
        }

        private string getCurTime()
        {
            CultureInfo culture = CultureInfo.InvariantCulture;
            try
            {
                DateTime CurrentDay = DateTime.Now;
                return CurrentDay.ToString("MM/dd/yyyy hh:mm:ss tt", culture);
            }
            catch (Exception ex)
            {
                return "Nan";
            }
        }

        private void t_Tick(object sender, EventArgs e)
        {
            var updateTime = tme;
            var currTime = getCurTime();
            lblTxt.Visible = true;
            lblTime.Visible = true;
            

            DateTime cur = DateTime.ParseExact(tme, "hh:mm tt", CultureInfo.InvariantCulture);

            TimeSpan Time = cur.AddHours(24) - DateTime.Now;
          
            Time = Time.Duration();

            var spanToString = Time.ToString(@"hh\:mm\:ss").Split(':');
            String hr = spanToString[0];
            String Mn = spanToString[1];
            String Sc = spanToString[2];
            lblTxt.Text = String.Format("Next Sync in:");
            lblchoy.Visible = true;
            lblTime.Text = hr + " : " + Mn + " : " + Sc;
            
            double hrtoMin = (Convert.ToInt32(spanToString[0]) * 60) + Convert.ToInt32(spanToString[1]);
            double percentToComplete = 1 - (hrtoMin / 1440);
            double progressVal = (pbWIDTH * percentToComplete);

            SetUpTimer(new TimeSpan(Time.Hours, Time.Minutes, Time.Seconds));
            //graphics
            g = Graphics.FromImage(bmp);

            //clear graphics
            g.Clear(Color.SteelBlue);

            //draw progressbar
            g.FillRectangle(Brushes.SkyBlue, new Rectangle(0, 0, (int)(progressVal), pbHEIGHT));
 
            //draw % complete
            //g.DrawString(pbComplete + "%", new Font("Arial", pbHEIGHT / 2), Brushes.Black, new PointF(pbWIDTH / 2 - pbHEIGHT, pbHEIGHT / 10));

            //load bitmap in picturebox picboxPB
            picboxPB.Image = bmp;
        }

        private void btnView_Click(object sender, EventArgs e)
        {
            Adjust();
        }

        private void Adjust() 
        {
            if (isExtend == false)
            {
                isExtend = true;
                btnView.Text = "▲";
                this.Size = new System.Drawing.Size(377, 306);
            }
            else
            {
                btnView.Text = "▼";
                isExtend = false;
                this.Size = new System.Drawing.Size(377, 154);
            }
        }

        //private void btnStart_Click(object sender, EventArgs e)
        //{
            
        //    if (isStarted == false)
        //    {
        //        isStarted = true;
        //        getUpdateTime();
        //        pbBoxConFig();
        //        //progressBar1.Style = ProgressBarStyle.Marquee;
        //        this.btnStart.BackgroundImage = ((System.Drawing.Image)(PayNearMe_Order_Update.Properties.Resources.play_btn));
        //    }
        //    else
        //    {
        //        isStarted = false;
        //        this.btnStart.BackgroundImage = ((System.Drawing.Image)(PayNearMe_Order_Update.Properties.Resources.stop_btn));
        //   }
        //}

        private void getUpdateTime()
        {
            tme = ReadIni.fromINIFile("UpdateTime", "Time");
            
        }

        private void SetUpTimer(TimeSpan alertTime)
        {
            //TimeSpan timeToExe = alertTime - current.TimeOfDay;
            if (alertTime == TimeSpan.Zero)
            {
                lblTime.Visible = false;
                lblTxt.ForeColor = Color.Red;
                lblTxt.Text = String.Format("Updating PaynearMe Order Status...");
                lblTxt.Refresh();
                RunMethodAt1200();
                Thread.Sleep(5000);
                lblTime.Visible = true;
                lblTxt.ForeColor = Color.Black;
            }

        }
        private void InvokeControlAction<Label>(Label cont, Action<Label> action) where Label : Control
        {
            if (cont.InvokeRequired)
            {
                cont.Invoke(new Action<Label, Action<Label>>(InvokeControlAction), new object[] { cont, action });
            }
            else
            {
                action(cont);
            }
        }

       private void RunMethodAt1200()
            {

                CallRestAPI.MLRestCaller openOrder = new CallRestAPI.MLRestCaller((ReadIni.fromINIFile("Network", "NetworkUrl")) + "tagVoidTransactions/", HttpVerb.GET);

                openOrder.ContentType = "application/json";

                ObjectJSON openOrderResp = JsonConvert.DeserializeObject<ObjectJSON>(openOrder.MakeRequest());
                if (openOrderResp.respcode == "1")
                {
                    Logs.makeLogs(openOrderResp.respcode, openOrderResp.respmsg, DateTime.Now.ToString("D"), "order" + DateTime.Now.ToString("MM"), "paynearme");
                }
                
            }

        private void display(string txt, string tom)
        {
            if (tom == "success")
            {
                MessageBox.Show(txt, "Message", MessageBoxButtons.OK, MessageBoxIcon.Information);    
            }
            else if (tom == "error")
            {
                MessageBox.Show(txt, "Message", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }



        private void btnUpdate_Click(object sender, EventArgs e)
        {
            isManualUpdate = true;
            DateTime upDate = dateTimePicker1.Value;
            upDate.ToString("yyyy-MM-dd");

            CallRestAPI.MLRestCaller manUpdate = new CallRestAPI.MLRestCaller((ReadIni.fromINIFile("Network", "NetworkUrl")) + "manualUpdate/?Date=" + upDate.ToString("yyyy-MM-dd"), HttpVerb.GET);

            manUpdate.ContentType = "application/json";

            ObjectJSON manUpdateResp = JsonConvert.DeserializeObject<ObjectJSON>(manUpdate.MakeRequest());
            if (manUpdateResp.respcode == "1")
            {
                isManualUpdate = false;
                display("Database has been successfully updated!", "success");
                Logs.makeLogs(manUpdateResp.respcode, manUpdateResp.respmsg, DateTime.Now.ToString("D"), "PayNearMe" + DateTime.Now.ToString("MM"), "PayNearMe");
            }
            else
	        {
               display("Something went wrong. Please contact the developer.","error");
               Logs.makeLogs(manUpdateResp.respcode, manUpdateResp.respmsg, DateTime.Now.ToString("D"), "PayNearMe" + DateTime.Now.ToString("MM"), "PayNearMe");
	        }
        }

        private void btnSave_Click(object sender, EventArgs e)
        {

            isResetPin = true;
            String upEmail = txtEmail.Text;
            bool valEmail;

            if (txtEmail.Text == "" || txtEmail.Text == string.Empty)
            {
                display("Please enter email.", "success");
                txtEmail.SelectAll();
                txtEmail.Focus();
                return;
            }

            valEmail = IsValidEmail(upEmail);

            if (valEmail == false)
            {
                display("Please enter a valid email.", "error");
                txtEmail.SelectAll();
                txtEmail.Focus();
                return;
            }

            CallRestAPI.MLRestCaller emailUpdate = new CallRestAPI.MLRestCaller((ReadIni.fromINIFile("Network", "NetworkUrl")) + "EmailPinUpdate/?Email=" + upEmail, HttpVerb.GET);

            emailUpdate.ContentType = "application/json";

            ObjectJSON emailUpdateResp = JsonConvert.DeserializeObject<ObjectJSON>(emailUpdate.MakeRequest());
            if (emailUpdateResp.respcode == "1")
            {
                isResetPin = false;
                txtEmail.Text = string.Empty;
                display("Database has been successfully updated!", "success");
                Logs.makeLogs(emailUpdateResp.respcode, emailUpdateResp.respmsg, DateTime.Now.ToString("D"), "PayNearMe" + DateTime.Now.ToString("MM"), "PayNearMe");
            } else if (emailUpdateResp.respcode == "4")
            {
                txtEmail.SelectAll();
                txtEmail.Focus();
                display("Email not found!", "error");
                Logs.makeLogs(emailUpdateResp.respcode, emailUpdateResp.respmsg, DateTime.Now.ToString("D"), "PayNearMe" + DateTime.Now.ToString("MM"), "PayNearMe");
            }
            else
            {
                display("Something went wrong. Please check logs for details.", "error");
                Logs.makeLogs(emailUpdateResp.respcode, emailUpdateResp.respmsg, DateTime.Now.ToString("D"), "PayNearMe" + DateTime.Now.ToString("MM"), "PayNearMe");
            }
        }


        private bool IsValidEmail(string emailaddress)
        {
            try
            {

                MailAddress m = new MailAddress(emailaddress);

                return true;
            }
            catch (FormatException)
            {
                return false;
            }
        }

        private void txtEmail_TextChanged(object sender, EventArgs e)
        {

        }

    }
}

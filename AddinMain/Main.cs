using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace AddinMain
{
    public class Main
    {

        public void EA_Connect(EA.Repository Repository)
        {

        }

        public object EA_GetMenuItems(EA.Repository Repository, string Location, string MenuName)
        {
            if (MenuName == "")
                return "-&EASample";
            else
            {
                String[] ret = { "&Sample" };
                return ret;
            }
        }

        public void EA_MenuClick(EA.Repository Rep, string Location, string MenuName, string ItemName)
        {
            if (ItemName == "&Sample")
            {
                MessageBox.Show("Hello world!");
            }
        }
    }

}

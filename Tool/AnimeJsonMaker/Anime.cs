using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AnimeJsonMaker
{
    public class Anime
    {
        public string showName = String.Empty;
        public string malLink = String.Empty;
        public string showSummary = String.Empty;
        public string imageLocation = String.Empty;
        public string genres = String.Empty;
        public string studio = String.Empty;
        public List<string> categories = new List<string>();

        public Anime(string showName)
        {
            this.showName = showName;
        }

        public override string ToString()
        {
            return showName;
        }
    }
}

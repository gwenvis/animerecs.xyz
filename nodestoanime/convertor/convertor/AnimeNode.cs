using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace convertor
{
    class AnimeNode
    {
        public string AnimeName;
        public string AnimeDescription;
        public string AnimePosterPath; //img/random_hash.png
        public string[] AnimeGenres;
        public string[] AnimeStudios;
        public double AnimeRating;

        public uint? direction_from = null;

        public AnimeNode(string name, string des, string path, string[] genres, string[] studios, double rating)
        {
            AnimeName = name;
            AnimeDescription = des;
            AnimePosterPath = path;
            AnimeGenres = genres;
            AnimeStudios = studios;
            AnimeRating = rating;
        }

        public void SetFrom(uint from)
        {
            direction_from = from;
        }
    }
}

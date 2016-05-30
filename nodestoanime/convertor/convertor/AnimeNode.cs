using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace convertor
{
    class AnimeNode : Node
    {
        public string AnimeName;
        public string AnimeDescription;
        public string AnimePosterPath; //img/random_hash.png
        public string MalLink;
        public string[] AnimeGenres;
        public string[] AnimeStudios;
        public double AnimeRating;

        public AnimeNode(string name, string des, uint id, string[] genres, string[] studios, string MalLink, double rating)
        {
            AnimeName = name;
            AnimeDescription = des;
            base.id = id;
            AnimeGenres = genres;
            AnimeStudios = studios;
            AnimeRating = rating;
            this.MalLink = MalLink;
            base.isAnimeObject = true;
        }
    }
}

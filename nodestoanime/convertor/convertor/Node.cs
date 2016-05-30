using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace convertor
{
    abstract class Node
    {
        public uint id = 0;

        public uint direction_from;
        public List<uint> direction_to = new List<uint>();
        public List<uint> ConnectedAnime = new List<uint>();
        public bool isAnimeObject = false;
        public bool leadsToAnime = false;

        public void AddDirectionTo(uint dir)
        {
            direction_to.Add(dir);
        }

        public void SetDirectionFrom(uint dir)
        {
            direction_from = dir;
        }
    }
}

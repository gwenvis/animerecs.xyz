using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace convertor
{
    class NodePath
    {
        public string name;
        public uint? direction_from, direction_to;

        public NodePath(string name)
        {
            this.name = name;
            direction_from = direction_to = null;
        }

        public void SetDirectionTo(uint dirto)
        {
            direction_to = dirto;
        }

        public void SetDirectionFrom(uint dirfrom)
        {
            direction_from = dirfrom;
        }
    }
}

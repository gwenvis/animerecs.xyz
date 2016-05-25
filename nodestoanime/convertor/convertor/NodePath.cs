using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace convertor
{
    class NodePath : Node
    {
        public string name;

        public NodePath(string name, uint id)
        {
            this.name = name;
            base.id = id;
        }
    }
}

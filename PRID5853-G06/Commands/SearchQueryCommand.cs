using PRID5853.G06.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PRID5853.G06.Commands
{
    public class SearchQueryCommand
    {
        public string Keywords { get; set; }
        public FilterEnum Filter { get; set; }
    }
}

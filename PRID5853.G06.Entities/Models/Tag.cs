using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace PRID5853.G06.Entities.Models
{
    public class Tag : EntityBase
    {
        [Required]
        public string Name { get; set; }

        public ICollection<PostTag> PostTags { get; set; }
    }
}
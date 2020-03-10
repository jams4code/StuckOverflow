using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace PRID5853.G06.Entities.Models
{
    public class PostTag : EntityBase
    {
        [Key]
        public int PostId { get; set; }
        public virtual Post Post { get; set; }
        [Key]
        public int TagId { get; set; }
        public Tag Tag { get; set; }
    }
}

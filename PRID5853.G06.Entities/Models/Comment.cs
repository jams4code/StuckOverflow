using PRID5853.G06.Entities.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace PRID5853.G06.Entities.Models
{
    public class Comment : EntityBase
    {
        [Required]
        public string Body { get; set; }
        public DateTime Timestamp { get; set; }
        public DateTime? EditTimeStamp { get; set; }
        public virtual User Author { get; set; }
        public int AuthorId { get; set; }
        public virtual Post Post { get; set; }
        public int PostId { get; set; }
    }
}

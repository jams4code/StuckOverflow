using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace PRID5853.G06.Entities.Models
{
    public class Post : EntityBase
    {
        public string Title { get; set; }
        [Required]
        public string Body { get; set; }
        [Required]
        public DateTime Timestamp { get; set; }
        public DateTime? EditTimeStamp { get; set; }

        public virtual ICollection<Comment> Comments { get; set; }
        public virtual User Author { get; set; }
        public int AuthorId { get; set; }
        public virtual ICollection<Post> Replies { get; set; }
        public virtual ICollection<Vote> Votes { get; set; }
        public virtual ICollection<PostTag> PostTags { get; set; }
        public virtual Post Parent { get; set; }
        public int? ParentId { get; set; }
        public int? AcceptedAnswerId { get; set; }
        public int NbViews { get; set; } = 0; // Implementing a basic counter (If we have time - Make it better by counting only distinct users).
        [NotMapped]
        public IEnumerable<Tag> Tags { get => PostTags?.Select(pt => pt.Tag);}
    }
}

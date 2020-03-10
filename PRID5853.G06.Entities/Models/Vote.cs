using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace PRID5853.G06.Entities.Models
{
    public class Vote : EntityBase
    {
        public Vote()
        {

        }
        public Vote(int authorId, int postId, int upDown) 
        {
            this.Id = 0;
            this.UpDown = upDown;
            this.AuthorId = authorId;
            this.PostId = postId;
        }
        [Required]
        public int UpDown { get; set; }

        public User Author { get; set; }
        [Key]
        public int AuthorId { get; set; }
        public Post Post { get; set; }
        [Key]
        public int PostId { get; set; }

        public override bool Equals(Object obj)
        {
            //Check for null and compare run-time types.
            if ((obj == null) || !this.GetType().Equals(obj.GetType()))
            {
                return false;
            }
            else
            {
                Vote vote = (Vote)obj;
                return (PostId == vote.PostId) && (AuthorId == vote.AuthorId);
            }
        }

        public override int GetHashCode()
        {
            return ((PostId << 2) ^ 13) / 7;
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PRID5853.G06.WebAPI.DTO
{
    public class PostDTO
    {
        public PostDTO()
        {
            Replies = new List<PostDTO>();
            Comments = new List<CommentDTO>();
            Tags = new List<PostTagDTO>();
            Votes = new List<VoteDTO>();
        }
        public int Id { get; set; }
        public string Title { get; set; }
        public string Body { get; set; }
        public DateTime? Timestamp { get; set; }
        public DateTime? EditTimeStamp { get; set; }
        public ICollection<PostDTO> Replies { get; set; }
        public int NbReplies { get; set; } = 0;
        public int? AcceptedAnswerId { get; set; }
        public int? ParentId { get; set; }
        public AuthorDTO Author { get; set; }
        public ICollection<CommentDTO> Comments { get; set; }
        public int Score { get; set; }
        public int NbViews { get; set; }
        public DateTime? LastActivityTimeStamp { get; set; }
        public ICollection<PostTagDTO> Tags { get; set; }
        public ICollection<VoteDTO> Votes { get; set; }
        

    }
}

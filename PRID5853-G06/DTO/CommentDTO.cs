using System;
namespace PRID5853.G06.WebAPI.DTO {
    public class CommentDTO
    {
        public int Id { get; set; }
        public string Body { get; set; }
        public DateTime Timestamp { get; set; }
        public DateTime? EditTimeStamp { get; set; }
        public int PostId { get; set; }
        public int AuthorId { get; set; }
        public AuthorDTO Author { get; set; }

    }
}
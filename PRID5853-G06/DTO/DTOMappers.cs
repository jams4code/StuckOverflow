using PRID5853.G06.Entities.Models;
using PRID5853.G06.WebAPI.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PRID5853.G06.WebAPI.DTO
{
    public static class DTOMappers {
        public static UserDTO ToDTO(this User user) {
            return new UserDTO {
                Id = user.Id,
                Pseudo = user.Pseudo,
                Email = user.Email,
                LastName = user.LastName,
                FirstName = user.FirstName,
                BirthDate = user.BirthDate,
                Reputation = user.Reputation,
                Role = user.Role,
            };
        }
        public static List<UserDTO> ToDTO(this IEnumerable<User> users) {
            return users.Select(u => u.ToDTO()).ToList();
        }
        //User to Author (To keep only useful info)
        public static AuthorDTO ToAuthorDTO(this User user)
        {
            return new AuthorDTO
            {
                Id = user.Id,
                Pseudo = user.Pseudo,
                Reputation = user.Reputation,
            };
        }
        public static CommentDTO ToDTO(this Comment comment){
            return new CommentDTO {
                Id = comment.Id,
                Body = comment.Body,
                Timestamp = comment.Timestamp,
                EditTimeStamp = comment.EditTimeStamp,
                PostId = comment.PostId,
                Author = comment.Author.ToAuthorDTO(),
                AuthorId = comment.AuthorId
            };
        }
        public static List<CommentDTO> ToDTO(this IEnumerable<Comment> comments){
            return comments.Select(c => c.ToDTO()).ToList();
        }
        public static PostDTO ToDTO (this Post post){
            PostDTO postDTO = new PostDTO();
            postDTO.Id = post.Id;
            postDTO.Title = post?.Title;
            postDTO.Body = post.Body;
            postDTO.Timestamp = post.Timestamp;
            postDTO.EditTimeStamp = post.EditTimeStamp;
            postDTO.Replies = post.Replies?.ToDTO();
            postDTO.NbReplies = post.Replies!=null? post.Replies.Count():0; //  Lambda Si replies pas null on va effectuer count sur la collection sinon on attribue 0
            postDTO.AcceptedAnswerId = post.AcceptedAnswerId;
            postDTO.Author = post.Author?.ToAuthorDTO();
            postDTO.Comments = post.Comments?.ToDTO();
            postDTO.Score = post.Votes!=null? (from v in post.Votes select v.UpDown).Sum():0;
            postDTO.NbViews = post.NbViews;
            postDTO.Votes = post.Votes?.ToDTO();
            postDTO.Tags = post.PostTags?.ToDTO();
            return postDTO;
        }
        public static List<PostDTO> ToDTO(this IEnumerable<Post> posts){
            return posts.Select(p => p.ToDTO()).ToList();
        }
        public static TagDTO ToDTO(this Tag tag){
            return new TagDTO{
                Id = tag.Id,
                Name = tag.Name,
            };
        }
        public static List<TagDTO> ToDTO(this IEnumerable<Tag> tags){
            return tags.Select(t => t.ToDTO()).ToList();
        }
        public static VoteDTO ToDTO(this Vote vote){
            return new VoteDTO{
                UpDown = vote.UpDown,
                AuthorId = vote.AuthorId
            };
        }
        public static List<VoteDTO> ToDTO(this IEnumerable<Vote> votes){
            return votes.Select(v => v.ToDTO()).ToList();
        }
        public static PostTagDTO ToDTO(this PostTag postTag)
        {
            return new PostTagDTO
            {
                Id = postTag.Tag.Id,
                Name = postTag.Tag.Name
            };
        }
        public static List<PostTagDTO> ToDTO(this IEnumerable<PostTag> postTags)
        {
            return postTags.Select(pt => pt.ToDTO()).ToList();
        }
    }
}
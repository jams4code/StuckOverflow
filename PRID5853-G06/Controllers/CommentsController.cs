using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PRID_Framework;
using PRID5853.G06.Entities.Models;
using PRID5853.G06.Persistence.Repository;
using PRID5853.G06.WebAPI.DTO;

namespace PRID5853.G06.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private readonly IEntityBaseRepository<Comment> _commentRepository;
        private readonly IEntityBaseRepository<User> _userRepository;
        private readonly IEntityBaseRepository<Post> _postRepository;

        public CommentsController(IEntityBaseRepository<Comment> commentRepository, IEntityBaseRepository<User> userRepository, IEntityBaseRepository<Post> postRepository)
        {
            _commentRepository = commentRepository;
            _userRepository = userRepository;
            _postRepository = postRepository;
        }

        [HttpPost("{postId}")]
        public async Task<ActionResult<CommentDTO>> AddComment(CommentDTO data, int postId)
        {
            try
            {

                Post post = await _postRepository.GetSingle(postId);
                User user = null;
                if(data.AuthorId != 0)
                    user = await _userRepository.GetSingle(data.AuthorId);
                if (post == null || user == null)
                {
                    var err = new ValidationErrors().Add("User or Post not found", nameof(post));
                    return BadRequest(err);
                }
                Comment comment = new Comment()
                {
                    AuthorId = user.Id,
                    Body = data.Body,
                    PostId = post.Id,
                    Timestamp = DateTime.Now

                };


                await _commentRepository.Add(comment).ConfigureAwait(true);
                return CreatedAtAction(nameof(AddComment), (comment).ToDTO());
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // PUT: api/Comments/5
        [HttpPut("{id}"), ActionName("Edit")]
        public async Task<ActionResult<CommentDTO>> UpdateComment(int id, CommentDTO commentDTO)
        {
            Comment comment = null;
            try
            {
                if (id != commentDTO.Id)
                {
                    return BadRequest();
                }
                comment = await _commentRepository.GetSingle(id);
                if (comment == null)
                {
                    return NotFound();
                }
                comment.Body = commentDTO.Body;
                comment.EditTimeStamp = DateTime.Now;
                

               
                await _commentRepository.Edit(comment);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
                throw;

            }

            return Ok(comment.ToDTO());
        }
        // DELETE: api/Comments/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<CommentDTO>> DeleteComment(int id)
        {
            var comment = await _commentRepository.GetSingle(id, add => add
                .Include(c => c.Author)
            );
            if (comment == null)
            {
                return NotFound();
            }
            try
            {
                await _commentRepository.Delete(comment);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
                throw;
            }
            return Ok(comment.ToDTO());
        }
    }
}
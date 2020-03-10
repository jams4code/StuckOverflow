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
using PRID5853.G06.Extensions;
using PRID5853.G06.Persistence.Context;
using PRID5853.G06.Persistence.Repository;
using PRID5853.G06.WebAPI.Controllers;
using PRID5853.G06.WebAPI.DTO;

namespace PRID5853.G06.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class VotesController : ControllerBase
    {
        private readonly IEntityBaseRepository<Vote> _voteRepository;
        private readonly IEntityBaseRepository<Post> _postRepository;
        private readonly IEntityBaseRepository<User> _userRepository;
        private readonly int _up = 1;
        private readonly int _down = -1;

        public VotesController(IEntityBaseRepository<Vote> voteRepository, IEntityBaseRepository<Post> postRepository, IEntityBaseRepository<User> userRepository)
        {
            _voteRepository = voteRepository;
            _postRepository = postRepository;
            _userRepository = userRepository;
        }

        //Après reflexion il serait préferable d'avoir un seul controller et de prendre la valeur du vote via le front end.
        //Mais afin de conserver la logique applicative hors du front end je laisse comme ça pour l'instant
        private async Task<PostDTO> DoVote(int userId, int postId, int valueVote)
        {
            var user = await _userRepository.GetSingle(userId);
            if (user == null)
            {
                return null;
            }
            
            var post = await _postRepository.GetSingle(postId, search => search
                .Include(p => p.Replies)
                    .ThenInclude(p => p.Author)
                    .ThenInclude(p => p.Comments)
                        .ThenInclude(c => c.Author)
                .Include(p => p.Author)
                .Include(p => p.Comments)
                    .ThenInclude(c => c.Author)
                .Include(p => p.PostTags)
                    .ThenInclude(pt => pt.Tag)
                .Include(p => p.Votes)
            );
            if (post == null)
            {
                return null;
            }
            Vote newVote = new Vote(userId,postId, valueVote);

            Vote oldVote = null ;
            if (post.Votes != null)
            {
                oldVote = (from vote in post.Votes
                            where vote.AuthorId == newVote.AuthorId
                            && vote.PostId == newVote.PostId
                            select vote).FirstOrDefault();
            }
            var postOwner = post.Author;
            var actor = user;
            ReputationAction action = ReputationAction.NegativeVote;
            bool userUpd = true;
            if (newVote.UpDown == 1)
            {
                action = ReputationAction.PositiveVote;
                
            }
            
            if (oldVote != null)
            {
                    
                if(oldVote.UpDown == newVote.UpDown) //(1)
                {
                    await _voteRepository.Delete(oldVote);
                    userUpd = false;
                } 
                else if(oldVote.UpDown == newVote.UpDown*(-1)) //(2)
                {
                    await _voteRepository.Delete(oldVote);
                    await _voteRepository.Add(newVote);
                    ReputationManagementExtension.ReputationUpdate(postOwner, actor, action);
                }
            } else
            {
                await _voteRepository.Add(newVote); //(3)
                ReputationManagementExtension.ReputationUpdate(postOwner, actor, action);
            }
            if (userUpd)
            {
                await _userRepository.Edit(postOwner);
                await _userRepository.Edit(actor);
            }

            return post.ToDTO();
        }
        // POST: api/Votes/up/UserId
        [HttpPost("Up/{postId}")]
        public async Task<ActionResult<PostDTO>> VoteUp([FromBody]UserDTO userDTO,  int postId)
        {
            if (userDTO.Reputation > 15)
            {
                try
                {
                    PostDTO post = await DoVote(userDTO.Id, postId, _up);
                    return CreatedAtAction(nameof(VoteUp), post); ;
                }
                catch (Exception ex)
                {
                    return StatusCode(500, ex.Message);
                }
            } else
            {
                return BadRequest();
            }
        }
        // POST: api/Votes/down/UserId
        [HttpPost("down/{postId}")]
        public async Task<ActionResult<PostDTO>> VoteDown([FromBody]UserDTO userDTO, int postId)
        {
            if(userDTO.Reputation > 30)
            {
                try
                {

                    PostDTO post = await DoVote(userDTO.Id, postId, _down);
                    return CreatedAtAction(nameof(VoteDown), post); ;
                }
                catch (Exception ex)
                {
                    return StatusCode(500, ex.Message);
                }
            } else
            {
                return BadRequest();
            }
            
        }
        [AllowAnonymous]
        [HttpPost("check/{postId}")]
        public async Task<ActionResult<VoteDTO>> CheckVote([FromBody]UserDTO userDTO, int postId)
        {
            var post = await _postRepository.GetSingle(postId, search => search
                .Include(p => p.Votes));
            var votes = post.Votes;
            if(votes != null)
            {
                var v = (from vote in votes
                            where vote.AuthorId == userDTO.Id
                            && vote.PostId == postId
                            select vote).FirstOrDefault();
                if(v != null)
                {
                    return v.ToDTO();
                }
            }
            return (new Vote(0, 0, 0)).ToDTO();
           
        }

    }
}

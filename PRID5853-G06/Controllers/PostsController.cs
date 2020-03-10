using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PRID_Framework;
using PRID5853.G06.Commands;
using PRID5853.G06.Entities.Models;
using PRID5853.G06.Extensions;
using PRID5853.G06.Persistence.Queries;
using PRID5853.G06.Persistence.Repository;
using PRID5853.G06.WebAPI.DTO;
using PRID5853.G06.WebAPI.Helpers;

namespace PRID5853.G06.WebAPI.Controllers
{
    [AllowAnonymous]
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly IEntityBaseRepository<Post> _postRepository;
        private readonly IEntityBaseRepository<PostTag> _postTagRepository;

        public PostsController(IEntityBaseRepository<Post> postRepository, IEntityBaseRepository<PostTag> postTagRepository)
        {
            _postRepository = postRepository;
            _postTagRepository = postTagRepository;
        }
        
        private async Task<IEnumerable<Post>> GetQuestionList()
        {
            //var RAW_SQL = "SELECT posts.*, MaxScore"
            //                + "FROM posts, ("
            //                + "SELECT parentid, max(Score) MaxScore"
            //                + "FROM("
            //                + "SELECT posts.Id, ifnull(posts.ParentId, posts.id) ParentId, ifnull(sum(votes.UpDown), 0) Score"
            //                + "FROM posts LEFT JOIN votes ON votes.PostId = posts.Id"
            //                + "GROUP BY posts.Id"
            //                + ") as tbl1"
            //                + "GROUP by parentid"
            //                + ") as q1"
            //                + "WHERE posts.id = q1.parentid"
            //                + "ORDER By q1.MaxScore desc, Timestamp desc;";

            //On doit utiliser ScoredPost pour cette Query
            //var query = await _scoredPostRepository.FromSqlQuery(RAW_SQL);
            IEnumerable<Post> questions = new List<Post>();
            //Utilisation Query2 de la FAQ pour le moment
            var criteria = new FindQuestionsList(
                    include => include
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
            questions = await _postRepository.FindBy(criteria);
            


            if (questions == null)
            {
                return null;
            }
            else
            {
                return questions;
            }
        }
        //Get Post with all informations
        private async Task<Post> GetPost(int id)
        {
            Post post = null;
            post = await _postRepository.GetSingle(id, search => search
                .Include(p => p.Replies)
                    .ThenInclude(p => p.Author)
                    .ThenInclude(p => p.Comments)
                        .ThenInclude(c => c.Author)
                    .ThenInclude(p => p.Votes)
                .Include(p => p.Author)
                .Include(p => p.Comments)
                    .ThenInclude(c => c.Author)
                .Include(p => p.PostTags)
                    .ThenInclude(pt => pt.Tag)
                .Include(p => p.Votes)
            );
            
            if(post == null)
            {
                return null;
            }
            else
            {
                return post;
            }
        }
        private async Task NbViewIncrement(Post post)
        {
            post.NbViews++; //If time try to improve this to increment only when it's differerent user (connected user) don't count for visitors? 
            await _postRepository.Edit(post);
        }
        //Last 3 questions
        // GET: api/Posts
        [HttpGet("Questions/Last")]
        public async Task<ActionResult<IEnumerable<PostDTO>>> GetLastQuestion()
        {
            IEnumerable<Post> topPost;
            try
            {
                topPost = await GetQuestionList();
                topPost = (from p in topPost
                           orderby p.Timestamp descending
                           select p).Take(3);
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                throw;
            }
            return Ok(topPost.ToDTO());
        }
        // GET: api/Posts
        [HttpGet("Questions/All")]
        public async Task<ActionResult<IEnumerable<PostDTO>>> GetAllQuestion()
        {
            IEnumerable<Post> topPost;
            try
            {
                topPost = await GetQuestionList();
                topPost.OrderByDescending(p => p.NbViews);
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                throw;
            }
            return Ok(topPost.ToDTO());
        }
        //Top questions
        // GET: api/Posts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PostDTO>>> GetQuestions()
        {
            IEnumerable<Post> topPost;
            try
            {
                topPost = await GetQuestionList();
                topPost = (from q in topPost
                           orderby q.Votes.Sum(v => v.UpDown) descending
                           select q).ToList();

            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                throw;
            }
            return Ok(topPost.ToDTO());
        }

        // GET: api/Posts
        [HttpGet("Tag/{tagId}")]
        public async Task<ActionResult<IEnumerable<PostDTO>>> GetQuestionsTag(int tagId)
        {
            IEnumerable<Post> topPost;
            try
            {
                var pt = new PostTag();
                pt.TagId = tagId;
                topPost = await GetQuestionList();
                topPost = (from q in topPost
                           where q.PostTags.Any(x => x.TagId == tagId)
                           orderby q.Votes.Sum(v => v.UpDown) descending
                           select q).ToList();

            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                throw;
            }
            return Ok(topPost.ToDTO());
        }

        // GET: api/Posts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PostDTO>> GetPostById(int id)
        {
            try
            {
                var post = await GetPost(id);

                if (post == null)
                {
                    return NotFound();
                }
                await NbViewIncrement(post);
                var postDTO = post.ToDTO();
                postDTO.LastActivityTimeStamp = LastPostActivity.GetLastPostActivity(post);
                return Ok(postDTO);
            }
            catch(Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // PUT: api/Posts/5
        [Authorize]
        [HttpPut("{id}"), ActionName("Edit")]
        public async Task<ActionResult<PostDTO>> UpdatePost(int id, PostDTO postDTO)
        {
            try
            {
                if (id != postDTO.Id)
                {
                    return BadRequest();
                }
                Post post = await GetPost(id);
                PostDTO tmpPostDTO = post.ToDTO();
                if (post == null)
                {
                    return NotFound();
                }
                post.Title = postDTO.Title;
                post.Body = postDTO.Body;
                post.EditTimeStamp = DateTime.Now;
                bool isNewAcceptedAnswer = post.AcceptedAnswerId != postDTO.AcceptedAnswerId;
                if (isNewAcceptedAnswer && postDTO.AcceptedAnswerId.HasValue && postDTO.AcceptedAnswerId != 0)
                {
                    var postOwner = post.Author;
                    var actor = (from r in post.Replies
                                where r.Id == postDTO.AcceptedAnswerId
                                select r.Author).FirstOrDefault();
                    var action = ReputationAction.AcceptedAnswer;
                    if(actor != null)
                    {
                        ReputationManagementExtension.ReputationUpdate(postOwner, actor, action);
                    }
                }
                post.AcceptedAnswerId = postDTO.AcceptedAnswerId;
                Console.WriteLine("\n " + tmpPostDTO.Tags + " \n - " + postDTO.Tags);

                if ((post.ParentId == 0 || post.ParentId == null) && CollectionMethodExtension.IsDifferentCollection<PostTagDTO>(tmpPostDTO.Tags, postDTO.Tags))
                {
                    //On pourrait utiliser une method generic - To Do si on a le temps - Bad Practice d'avoir une method aussi longue
                    foreach (PostTagDTO tag in postDTO.Tags)
                    {
                        if (!tmpPostDTO.Tags.Contains(tag))
                        {
                            PostTag pt = new PostTag();
                            pt.PostId = post.Id;
                            pt.TagId = tag.Id;
                            await _postTagRepository.Add(pt).ConfigureAwait(true);
                        }
                    }
                    foreach (PostTagDTO tag in tmpPostDTO.Tags)
                    {
                        if (!postDTO.Tags.Contains(tag))
                        {
                            PostTag pt = new PostTag();
                            pt.PostId = post.Id;
                            pt.TagId = tag.Id;
                            await _postTagRepository.Delete(pt).ConfigureAwait(true);
                        }
                    }
                }
                 await _postRepository.Edit(post);
            }
            catch(Exception ex)
            {
                return StatusCode(500, ex);
                throw;

            }

            return Ok((await GetPost(id)).ToDTO());
        }

        // POST: api/Posts
        [Authorize]
        [HttpPost("{parentId}")]
        public async Task<ActionResult<PostDTO>>AddPost(PostDTO data, int parentId)
        {
            try
            {

                var post = await _postRepository.GetSingle(data.Id);
                if (post != null)
                {
                    var err = new ValidationErrors().Add("Id already in use", nameof(post.Id));
                    return BadRequest(err);
                }
                Post newPost = new Post()
                {
                    Title = data.Title,
                    Timestamp = data?.Timestamp ?? DateTime.Now, //Si null Génére un DateTime actuel
                    Body = data.Body,
                    AuthorId = data.Author.Id,

                    //Pas besoin d'ajouter le reste car ils seront toujours empty
                };
                if(parentId > 0)
                {
                    newPost.ParentId = parentId;
                }
                
                await _postRepository.Add(newPost).ConfigureAwait(true);
                if (parentId == 0 && data.Tags.Count() > 0)
                {
                    foreach (PostTagDTO tag in data.Tags)
                    {
                        PostTag pt = new PostTag();
                        pt.PostId = newPost.Id;
                        pt.TagId = tag.Id;
                        await _postTagRepository.Add(pt);
                    }
                }
                return CreatedAtAction(nameof(AddPost), (await GetPost(newPost.Id)).ToDTO());
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // DELETE: api/Posts/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult<PostDTO>> DeletePost(int id)
        {
            var post = await this.GetPost(id);
            if (post == null)
            {
                return NotFound();
            }
            try
            {
                await _postRepository.Delete(post);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
                throw;
            }
            return Ok(post.ToDTO());
        }
        [Authorize]
        [HttpGet("Filter")]
        public async Task<ActionResult<ICollection<PostDTO>>> GetQuestionsByKeyword([FromQuery]SearchQueryCommand query)
        {
            try
            {
                ICollection<Post> questions;
                if (query.Keywords != null)
                {
                    questions = await _postRepository.FindBy(new SearchByKeyword(query.Keywords, search => search
                    .Include(p => p.Replies)
                        .ThenInclude(p => p.Author)
                        .ThenInclude(p => p.Comments)
                            .ThenInclude(c => c.Author)
                        .ThenInclude(p => p.Votes)
                    .Include(p => p.Author)
                    .Include(p => p.Comments)
                        .ThenInclude(c => c.Author)
                    .Include(p => p.PostTags)
                        .ThenInclude(pt => pt.Tag)
                    .Include(p => p.Votes)
                    ));
                } 
                else
                {
                    questions = (await this.GetQuestionList()).ToList();
                }
                
                
                if (questions == null)
                {
                    return NotFound();
                }
                else
                {
                    ICollection<PostDTO> questDTO = questions.ToDTO();
                    questDTO = OrderedQuestions(questDTO, query.Filter);
                    return Ok(questDTO);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
                throw;
            }
        }
        private ICollection<PostDTO> OrderedQuestions(ICollection<PostDTO> questions, FilterEnum filter)
        {
            switch (filter)
            {
                case FilterEnum.ByTime:
                    questions = (from p in questions
                                 orderby p.Timestamp descending
                                 select p).ToList();
                    break;
                case FilterEnum.NotAnswered:
                    questions = (from q in questions
                                 where q.Replies.Count == 0
                                 select q).ToList();
                    break;
                default:
                    questions = (from q in questions
                                 orderby q.Votes.Sum(v => v.UpDown) descending
                                 select q).ToList();
                    break;
            }
            return questions;
        }


    }
}

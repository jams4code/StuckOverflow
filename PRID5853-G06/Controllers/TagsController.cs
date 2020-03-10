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
using PRID5853.G06.WebAPI.Helpers;

namespace PRID5853.G06.WebAPI.Controllers
{
    [Authorized(Role.Admin)]
    [Route("api/[controller]")]
    [ApiController]
    public class TagsController : ControllerBase
    {
        private readonly IEntityBaseRepository<Tag> _tagRepository;

        public TagsController(IEntityBaseRepository<Tag> tagRepository)
        {
            _tagRepository = tagRepository;
        }

        // GET: api/Tags
        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<ICollection<TagDTO>>> GetTags()
        {

            IEnumerable<Tag> tags = null;
            tags = await _tagRepository.GetAll();
            if (tags == null)
            {
                return null;
            }
            else
            {
                return tags.ToDTO();
            }
        }

        // GET: api/Tags/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TagDTO>> GetTag(int id)
        {
            Tag tag = null;
            tag = await _tagRepository.GetSingle(id);

            if (tag == null)
            {
                return null;
            }

            return tag.ToDTO();
        }

        // PUT: api/Tags/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTag(int id, TagDTO tagDTO)
        {
            try
            {
                if (id != tagDTO.Id)
                {
                    return BadRequest();
                }
                Tag tag = await _tagRepository.GetSingle(id);
                if (tag == null)
                {
                    return NotFound();
                }
                tag.Name = tagDTO.Name;
                await _tagRepository.Edit(tag);

            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
                throw;

            }

            return Ok(await GetTag(id));
        }

        // POST: api/Tags
        [HttpPost]
        public async Task<ActionResult<TagDTO>> AddTag(TagDTO data)
        {
            try
            {
                var tag = await _tagRepository.GetSingle(data.Id);
                if (tag != null)
                {
                    var err = new ValidationErrors().Add("Id already in use", nameof(tag.Id));
                    return BadRequest(err);
                }
                Tag newTag = new Tag()
                {
                    Name = data.Name
                };


                await _tagRepository.Add(newTag);

                return CreatedAtAction(nameof(AddTag), await GetTag(newTag.Id));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // DELETE: api/Tags/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Tag>> DeleteTag(int id)
        {
            var tag = await _tagRepository.GetSingle(id);
            if (tag == null)
            {
                return NotFound();
            }
            try
            {
                await _tagRepository.Delete(tag);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
                throw;
            }
            return Ok(tag);
        }

    }
}

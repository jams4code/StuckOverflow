using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PRID_Framework;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Security.Claims;
using System;
using Microsoft.IdentityModel.Tokens;
using PRID5853.G06.WebAPI.Helpers;
using PRID5853.G06.Entities.Models;
using PRID5853.G06.Persistence.Repository;
using PRID5853.G06.WebAPI.DTO;
using PRID5853.G06.Persistence.Queries;
using PRID5853.G06.Persistence.Helpers;

namespace PRID5853.G06.WebAPI.Controllers
{
    [AllowAnonymous]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IEntityBaseRepository<User> _userRepository;

        public UsersController(IEntityBaseRepository<User> userRepository)
        {
            _userRepository = userRepository;

        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetAll() {


            IEnumerable<User> users = null;
            users = await _userRepository.GetAll();
            if (users == null)
            {
                return null;
            }
            else
            {
                return users.ToDTO();
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserDTO>> GetUser(int id) {
            User user = null;
            user = await _userRepository.GetSingle(id, search => search
            .Include(u => u.Posts)
            .Include(u => u.Votes)
            );

            if (user == null)
            {
                return null;
            }
            else
            {
                return user.ToDTO();
            }
        }

        [HttpPost]        
        public async Task<ActionResult<UserDTO>> PostUser(UserDTO data) {
            try
            {
                var user = await _userRepository.GetSingle(data.Id);
                if (user != null)
                {
                    var err = new ValidationErrors().Add("Pseudo already in use", nameof(user.Pseudo));
                    return BadRequest(err);
                }
                if (data.Password == null)
                {
                    data.Password = "def123";
                }
                var newUser = new User()
                {
                    Pseudo = data.Pseudo,
                    Password = TokenHelper.GetPasswordHash(data.Password),
                    Email = data.Email,
                    LastName = data.LastName,
                    FirstName = data.FirstName,
                    BirthDate = data.BirthDate,
                    Reputation = data.Reputation,
                    Role = data.Role

                };
                await _userRepository.Add(newUser);
                return CreatedAtAction(nameof(GetUser), new { id = newUser.Id }, newUser.ToDTO());
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, UserDTO userDTO) {
            try
            {
                if (id != userDTO.Id)
                    return BadRequest();
                var user = await _userRepository.GetSingle(id).ConfigureAwait(false);
                if (user == null)
                    return NotFound();
                user.Pseudo = userDTO.Pseudo;
                user.LastName = userDTO.LastName;
                user.FirstName = userDTO.FirstName;
                user.Email = userDTO.Email;
                user.BirthDate = userDTO.BirthDate;
                user.Reputation = userDTO.Reputation;
                user.Role = userDTO.Role;
                await _userRepository.Edit(user);
                return Ok(await GetUser(user.Id));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // DELETE: api/Users/5
        [Authorized(Role.Admin)]
        [HttpDelete("{id}")]
        public async Task<ActionResult<UserDTO>> DeleteUser(int id)
        {
            var user = await _userRepository.GetSingle(id).ConfigureAwait(false);

            if (user == null)
            {
                return NotFound();
            }
            try
            {
                await _userRepository.Delete(user);
            }
            catch(Exception ex)
            {
                return StatusCode(500, ex);
                throw;
            }
            


            return Ok(user.ToDTO());
        }


        [HttpPost("authenticate")]
        public async Task<ActionResult<User>> Authenticate(UserDTO data)
        {
            try
            {
                var user = await Authenticate(data.Pseudo, data.Password);
                if (user == null)
                    return BadRequest(new ValidationErrors().Add("Member not found", "Pseudo"));
                if (user.Token == null)
                    return BadRequest(new ValidationErrors().Add("Incorrect password", "Password"));
                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
            
        }
        private async Task<User> Authenticate(string pseudo, string password)
        {
            var user = await _userRepository.FindFirstBy(new UserByIdentifierQuery(pseudo));
            if (user == null)
                return null;
            password = TokenHelper.GetPasswordHash(password);
            if (user.Password == password)
            {
                // authentication successful so generate jwt token
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes("my-super-secret-key");
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                                                 {
                                             new Claim(ClaimTypes.Name, user.Pseudo),
                                             new Claim(ClaimTypes.Role, user.Role.ToString())
                                                 }),
                    IssuedAt = DateTime.UtcNow,
                    Expires = DateTime.UtcNow.AddMinutes(10),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };
                var token = tokenHandler.CreateToken(tokenDescriptor);
                user.Token = tokenHandler.WriteToken(token);
            }
            // remove password before returning
            user.Password = null;
            return user;
        }

        [HttpPost("signup")]
        public async Task<ActionResult<UserDTO>> SignUp(UserDTO data)
        {
            return await PostUser(data);
        }

        [HttpGet("available/pseudo/{pseudo}")]
        public async Task<ActionResult<bool>> IsAvailablePseudo(string pseudo)
        {
            var user = await _userRepository.FindBy(new UserByIdentifierQuery(pseudo));
            return user.Count == 0;
        }

        [HttpGet("available/email/{email}")]
        public async Task<ActionResult<bool>> IsAvailableEmail(string email)
        {
            var user = await _userRepository.FindBy(new UserByIdentifierQuery(email));
            return user.Count == 0;
        }
    }
}
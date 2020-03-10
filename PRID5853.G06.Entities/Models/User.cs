using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics;
using PRID5853.G06.Validators;

namespace PRID5853.G06.Entities.Models
{
    public enum Role
    {
        Visitor = 0,
        Member = 1,
        Admin = 2
    }
    public class User : EntityBase
    {
        //-----------------------------------------------------//
        [Required(ErrorMessage = "Required")]
        [MinLength(3, ErrorMessage = "Minimum 3 characters")]
        [MaxLength(10, ErrorMessage = "Maximum 10 characters")]
        [RegularExpression("^[a-zA-Z]([a-zA-Z0-9_]+)$")]
        public string Pseudo { get; set; }
        //-----------------------------------------------------//
        [Required(ErrorMessage = "Required")]
        [MinLength(3, ErrorMessage = "Minimum 3 characters")]
        public string Password { get; set; }
        //-----------------------------------------------------//

        [Required(ErrorMessage = "Required")]
        [DataType(DataType.EmailAddress)]
        [EmailAddress(ErrorMessage = "Incorrect email address")]
        public string Email { get; set; }
        //-----------------------------------------------------//
        [MinLength(3, ErrorMessage = "Minimum 3 characters")]
        [MaxLength(50, ErrorMessage = "Maximum 50 characters")]
        public string LastName { get; set; }
        //-----------------------------------------------------//
        [MinLength(3, ErrorMessage = "Minimum 3 characters")]
        [MaxLength(50, ErrorMessage = "Maximum 50 characters")]
        //Facultatif sauf si LastName non null
        [RequiredIf("LastName", "")] //To check if working
        public string FirstName { get; set; }
        //-----------------------------------------------------//
        [MinAge(18)]
        public DateTime? BirthDate { get; set; }
        //-----------------------------------------------------//
        [Required(ErrorMessage = "Required")]
        [Range(0, Double.PositiveInfinity)]
        private int reputation;
        public int Reputation {
            get { return reputation; }
            set 
            {
                var tmpReputation = value;
                if(tmpReputation < 0)
                {
                    reputation = 0;
                } else if (tmpReputation > 100)
                {
                    reputation = 100;
                } 
                else
                {
                    reputation = tmpReputation;
                }
            }
        }

        public Role Role { get; set; } = Role.Member;
        [NotMapped]
        public string Token { get; set; }
        public ICollection<Comment> Comments { get; set; }
        public ICollection<Vote> Votes { get; set; }
        public ICollection<Post> Posts { get; set; }
    }
}
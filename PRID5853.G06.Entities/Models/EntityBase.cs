using PRID5853.G06.Entities.Interfaces;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace PRID5853.G06.Entities.Models
{
    public class EntityBase : IEntityBase
    {
        [Required]
        [Key]
        public int Id { get; set; }
    }
}

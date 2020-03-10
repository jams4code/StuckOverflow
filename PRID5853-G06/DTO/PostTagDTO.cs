using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PRID5853.G06.WebAPI.DTO
{
    public class PostTagDTO
    {
        public int Id { get; set; }
        public string Name {get; set;}

        public override bool Equals(Object obj)
        {
            //Check for null and compare run-time types.
            if ((obj == null) || !this.GetType().Equals(obj.GetType()))
            {
                return false;
            }
            else
            {
                PostTagDTO pt = (PostTagDTO)obj;
                return (Id == pt.Id)/* && (Name == pt.Name) Pas nécessaire de comparer le nom*/;
            }
        }

        public override int GetHashCode()
        {
            return ((Id << 2) ^ 13 )/7;
        }
    }

}

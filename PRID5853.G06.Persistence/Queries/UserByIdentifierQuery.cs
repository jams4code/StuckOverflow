using PRID5853.G06.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace PRID5853.G06.Persistence.Queries
{
    public class UserByIdentifierQuery : BaseSpecification<User>
    {
        public UserByIdentifierQuery(string uniqueIdentifier) 
        {
            Criteria = BuildCriteria(uniqueIdentifier);

        }
        private Expression<Func<User, bool>> BuildCriteria(string uniqueIdentifier)
        {
            if (!String.IsNullOrEmpty(uniqueIdentifier))
                return u => (u.Pseudo == uniqueIdentifier) ||(u.Email == uniqueIdentifier);
            else
                return null;
        }
    }
}

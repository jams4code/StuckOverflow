using Microsoft.EntityFrameworkCore.Query;
using PRID5853.G06.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;

namespace PRID5853.G06.Persistence.Queries
{
    public class FindQuestionsList : BaseSpecification<Post>
    {
        public FindQuestionsList(Func<IQueryable<Post>, IIncludableQueryable<Post, object>> includes = null)
        {
            Criteria = BuildCriteria();
            Includes = includes;

        }
        private Expression<Func<Post, bool>> BuildCriteria()
        {
            return c => (c.ParentId == null);
        }
    }
}

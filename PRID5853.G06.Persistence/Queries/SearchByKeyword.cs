using Microsoft.EntityFrameworkCore.Query;
using PRID5853.G06.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;

namespace PRID5853.G06.Persistence.Queries
{
    public class SearchByKeyword : BaseSpecification<Post>
    {
        public string Keywords { get; set; }

        public SearchByKeyword(string keywords, Func<IQueryable<Post>, IIncludableQueryable<Post, object>> includes = null) 
        {
            if (!String.IsNullOrEmpty(keywords))
                this.Keywords = keywords.ToUpper();
            else
                this.Keywords = "";
            Criteria = BuildCriteria();
            Includes = includes;

        }

        private Expression<Func<Post, bool>> BuildCriteria()
        {
            
            Expression<Func<Post, bool>> filterQuery = post => ((post.ParentId == null && post.PostTags.Count() > 0)
                                                                && post.Body.ToUpper().Contains(Keywords)
                                                                || post.Title.ToUpper().Contains(Keywords)
                                                                || post.PostTags.Any(t => t.Tag.Name.ToUpper().Contains(Keywords))
                                                                );

            return filterQuery;
        }
    }
}

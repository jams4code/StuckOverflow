using Microsoft.EntityFrameworkCore.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;

namespace PRID5853.G06.Persistence.Interfaces
{
    public interface ISpecification<T>
    {
        Expression<Func<T, bool>> Criteria { get; }
        Func<IQueryable<T>, IIncludableQueryable<T, object>> Includes { get; }
        List<string> IncludeStrings { get; }
        int? Page { get; }
        int? PageSize { get; }
    }
}

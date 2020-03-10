using Microsoft.EntityFrameworkCore.Query;
using PRID5853.G06.Persistence.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;

namespace PRID5853.G06.Persistence.Queries
{
    public abstract class BaseSpecification<T> : ISpecification<T>
    {
        public BaseSpecification()
        {
        }
        //page et pageSize - si on veut créer un paging pour les questions;
        public BaseSpecification(int? pageSize, int? page)
        {
            PageSize = pageSize;
            Page = page;

        }

        public BaseSpecification(Expression<Func<T, bool>> criteria)
        {
            Criteria = criteria;
            PageSize = null;
            Page = null;
        }
        public BaseSpecification(Expression<Func<T, bool>> criteria, int pageSize, int page) : this(criteria)
        {
            PageSize = pageSize;
            Page = page;
        }
        public int? PageSize { get; }
        public int? Page { get; }
        public Expression<Func<T, bool>> Criteria { get; protected set; }
        public Func<IQueryable<T>, IIncludableQueryable<T, object>> Includes { get; protected set; }
        public List<string> IncludeStrings { get; } = new List<string>();

        protected virtual void AddInclude(Func<IQueryable<T>, IIncludableQueryable<T, object>> includeExpression)
        {
            Includes = includeExpression;
        }
        // string-based includes allow for including children of children, e.g. Basket.Items.Product
        protected virtual void AddInclude(string includeString)
        {
            IncludeStrings.Add(includeString);
        }
    }
}

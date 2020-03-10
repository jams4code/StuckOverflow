using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using PRID5853.G06.Entities.Interfaces;
using PRID5853.G06.Persistence.Context;
using PRID5853.G06.Persistence.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PRID5853.G06.Persistence.Repository
{
    public class EntityBaseRepository<T> : IEntityBaseRepository<T>
        where T : class, IEntityBase, new()
    {

        private PridDbContext _dbContext;

        #region Properties


        protected PridDbContext DbContext
        {
            get { return _dbContext; }
        }
        public EntityBaseRepository(PridDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        #endregion
        public async virtual Task<ICollection<T>> GetAll()
        {
            return await DbContext.Set<T>().ToListAsync<T>();
        }

        public virtual IQueryable<T> AllIncluding(Func<IQueryable<T>, IIncludableQueryable<T, object>> includeProperties)
        {
            IQueryable<T> query = DbContext.Set<T>();
            if (includeProperties != null)
                query = includeProperties(query);

            return query;
        }
        public virtual async Task<ICollection<T>> GetAllIncluding(Func<IQueryable<T>, IIncludableQueryable<T, object>> includeProperties = null)
        {
            if (includeProperties != null)
            {
                return await AllIncluding(includeProperties).ToListAsync();
            }

            return await DbContext.Set<T>().ToListAsync();
        }
        public async Task<T> GetSingle(int id, Func<IQueryable<T>, IIncludableQueryable<T, object>> includeProperties = null)
        {
            if (includeProperties != null)
                return await AllIncluding(includeProperties).FirstOrDefaultAsync(c => c.Id == id);
            return await DbContext.Set<T>().FindAsync(id);
        }
        public async Task<int> FindByCount(ISpecification<T> predicate)
        {

            // return the result of the query using the specification's criteria expression
            return await DbContext.Set<T>().Where(predicate.Criteria).CountAsync();
        }
        public async virtual Task<ICollection<T>> FindBy(ISpecification<T> predicate)
        {

            // fetch a Queryable that includes all expression-based includes
            IQueryable<T> queryableResultWithIncludes = DbContext.Set<T>();
            if (predicate.Includes != null)
                queryableResultWithIncludes = AllIncluding(predicate.Includes);

            // modify the IQueryable to include any string-based include statements
            var secondaryResult = predicate.IncludeStrings
                .Aggregate(queryableResultWithIncludes,
                    (current, include) => current.Include(include));

            // return the result of the query using the specification's criteria expression
            var query = queryableResultWithIncludes.Where(predicate.Criteria);
            if (predicate.Page.HasValue && predicate.PageSize.HasValue)
                query = query.Skip((predicate.Page.Value - 1) * predicate.PageSize.Value).Take(predicate.PageSize.Value);

            return await query.ToListAsync<T>();

        }

        public async virtual Task<T> FindFirstBy(ISpecification<T> predicate)
        {

            // fetch a Queryable that includes all expression-based includes
            IQueryable<T> queryableResultWithIncludes = DbContext.Set<T>();
            if (predicate.Includes != null)
                queryableResultWithIncludes = AllIncluding(predicate.Includes);

            // modify the IQueryable to include any string-based include statements
            var secondaryResult = predicate.IncludeStrings
                .Aggregate(queryableResultWithIncludes,
                    (current, include) => current.Include(include));

            // return the result of the query using the specification's criteria expression
            var query = queryableResultWithIncludes.Where(predicate.Criteria);
            if (predicate.Page.HasValue && predicate.PageSize.HasValue)
                query = query.Skip((predicate.Page.Value - 1) * predicate.PageSize.Value).Take(predicate.PageSize.Value);

            return await query.FirstOrDefaultAsync<T>();

        }
        //Implementic Generic method for query with RawSqlString
        public async virtual Task<ICollection<T>> FromSqlQuery(string rawSqlString)
        {

            
            IQueryable<T> queryableResultWithIncludes = DbContext.Set<T>();

            var query = queryableResultWithIncludes.FromSql(rawSqlString);

            return await query.ToListAsync<T>();

        }
        public async virtual Task<int> Add(T entity)
        {
            DbContext.Set<T>().Add(entity);
            await DbContext.SaveChangesAsync();
            return entity.Id;
        }
        public async virtual Task Edit(T entity)
        {
            DbContext.Update<T>(entity);
            await DbContext.SaveChangesAsync();
        }
        public async virtual Task Delete(T entity)
        {
            DbContext.Remove<T>(entity);
            await DbContext.SaveChangesAsync();
        }
        public async virtual Task Delete(int id)
        {
            T entity = await GetSingle(id);

            await Delete(entity);
            await DbContext.SaveChangesAsync();
        }
        public async virtual Task Save()
        {
            await DbContext.SaveChangesAsync();
        }
    }
}

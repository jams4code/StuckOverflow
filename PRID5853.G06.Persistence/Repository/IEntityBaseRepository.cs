using Microsoft.EntityFrameworkCore.Query;
using PRID5853.G06.Entities.Interfaces;
using PRID5853.G06.Persistence.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PRID5853.G06.Persistence.Repository
{
    public interface IEntityBaseRepository<T> where T : class, IEntityBase, new()
    {
        IQueryable<T> AllIncluding(Func<IQueryable<T>, IIncludableQueryable<T, object>> includeProperties);
        Task<ICollection<T>> GetAllIncluding(Func<IQueryable<T>, IIncludableQueryable<T, object>> includeProperties);
        Task<ICollection<T>> GetAll();
        Task<T> GetSingle(int id, Func<IQueryable<T>, IIncludableQueryable<T, object>> includeProperties = null);
        Task<ICollection<T>> FindBy(ISpecification<T> predicate);
        Task<T> FindFirstBy(ISpecification<T> predicate);
        Task<ICollection<T>> FromSqlQuery(string rawSqlString);
        Task<int> FindByCount(ISpecification<T> predicate);
        Task<int> Add(T entity);
        Task Delete(T entity);
        Task Delete(int Id);
        Task Edit(T entity);
        Task Save();
    }
}

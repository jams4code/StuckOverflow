using PRID5853.G06.Entities.Models;
using Microsoft.EntityFrameworkCore;

namespace PRID5853.G06.Persistence.Context
{
    public interface IPridDbContext
    {
        DbSet<User> Users { get; set; }
        DbSet<Comment> Comments { get; set; }
        DbSet<Tag> Tags { get; set; }
        DbSet<Post> Posts { get; set; }
        DbSet<Vote> Votes { get; set; }
        DbSet<PostTag> PostTags { get; set; }
        DbSet<ScoredPost> ScoredPosts { get; set; }
    }
}

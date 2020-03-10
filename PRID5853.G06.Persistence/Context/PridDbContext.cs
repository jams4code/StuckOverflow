using Microsoft.EntityFrameworkCore;
using PRID5853.G06.Entities.Models;

namespace PRID5853.G06.Persistence.Context
{
    public class PridDbContext : DbContext, IPridDbContext
    {
        public PridDbContext(DbContextOptions<PridDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<Vote> Votes { get; set; }
        public DbSet<PostTag> PostTags { get; set; }
        public DbSet<ScoredPost> ScoredPosts { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder) {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<User>()
                               .HasIndex(u => u.Pseudo)
                               .IsUnique();
            modelBuilder.Entity<User>()
                                .HasIndex(u => u.Email)
                                .IsUnique();
            modelBuilder.Entity<Tag>()
                                .HasIndex(t => t.Name)
                                .IsUnique();
            //Model Relationship
            modelBuilder.Entity<PostTag>()
                                .HasKey(pt => new { pt.PostId, pt.TagId });
            modelBuilder.Entity<Vote>()
                                .HasKey(v => new { v.PostId, v.AuthorId });
            //Comment two Relations
            modelBuilder.Entity<Comment>()
                                .HasOne(c => c.Author)
                                .WithMany(u => u.Comments)
                                .HasForeignKey(c => c.AuthorId)
                                .IsRequired(true)
                                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Comment>()
                                .HasOne(c => c.Post)
                                .WithMany(p => p.Comments)
                                .HasForeignKey(c => c.PostId)
                                .IsRequired(true)
                                .OnDelete(DeleteBehavior.Cascade);
            //Vote 2 Relations
            modelBuilder.Entity<Vote>()
                                .HasOne(c => c.Author)
                                .WithMany(v => v.Votes)
                                .HasForeignKey(c => c.AuthorId)
                                .IsRequired(true)
                                .OnDelete(DeleteBehavior.Cascade);
            //PostTag
            
            modelBuilder.Entity<PostTag>()
                                .HasOne(pt => pt.Post)
                                .WithMany(p => p.PostTags)
                                .HasForeignKey(pt => pt.PostId)
                                .IsRequired(true)
                                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<PostTag>()
                                .HasOne(pt => pt.Tag)
                                .WithMany(t => t.PostTags)
                                .HasForeignKey(pt => pt.TagId)
                                .IsRequired(true)
                                .OnDelete(DeleteBehavior.Cascade);
            //Post 
            modelBuilder.Entity<Post>()
                                .HasOne(p => p.Author)
                                .WithMany(u => u.Posts)
                                .HasForeignKey(p => p.AuthorId)
                                .IsRequired(true)
                                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Post>()
                                .HasMany(p => p.Replies)
                                .WithOne(p => p.Parent)
                                .HasForeignKey(p => p.ParentId)
                                .HasPrincipalKey(p => p.Id)
                                .OnDelete(DeleteBehavior.Cascade);


            //----------------------

            //modelBuilder.Entity<User>().HasData(
            //    new User()  { Id = 1, Pseudo = "Jamal", Password = "jamal123", Email = "jamal2@test.com", LastName = "Abd", FirstName = "Jamal", BirthDate = new System.DateTime(1997,05,28), Reputation = 100, Role = Role.Admin },
            //    new User()  { Id = 2, Pseudo = "Jimmy", Email = "Jimmy@test.com", Password = "Jimmy123", LastName = "Jim", FirstName = "Jimmy", Reputation = 50 },
            //    new User()  { Id = 3, Pseudo = "admin", Password = "admin", Email = "admin@test.com", Role = Role.Admin } 
            //);
            

        }
    }
}
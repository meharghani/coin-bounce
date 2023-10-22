class BlogDetailsDTO {
  constructor(blog) {
    this.id = blog._id;
    this.content = blog.content;
    this.title = blog.title;
    this.photo = blog.photoPath;
    this.createdAt = blog.createdAt;
    this.authorName = blog.author.name;
    this.authorUsername = blog.author.username;
    this.authorId = blog.author._id;
  }
}
module.exports = BlogDetailsDTO;

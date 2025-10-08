const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((a, c) => a + c.likes, 0)
}

const mostBlogs = (blogs) => {
  let author = ''
  let totalBlogs = 0
  blogs.forEach(element => {
    let count = blogs.filter(blog => blog.author === element.author).length
    if (count > totalBlogs){
      author = element.author
      totalBlogs = count
    }
  })
  return {
    'author': author,
    'blogs': totalBlogs
  }
}

const favoriteBlog = (blogs) => {
  let favorite = { 'likes' : 0 }
  blogs.forEach(blog => {
    favorite = (blog.likes > favorite.likes) ? blog : favorite
  })
  return favorite
}

const mostLikes = (blogs) => {
  let author = ''
  let likes = 0
  blogs.forEach(element => {
    let c = blogs.filter(blog => blog.author === element.author).reduce((a, c) => a + c.likes, 0)
    if (c > likes){
      author = element.author
      likes = c
    }
  })
  return {
    'author': author,
    'likes': likes
  }
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
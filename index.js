const fileUpload = require('express-fileupload')
const BlogPost = require('./models/BlogPost.js')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const ejs = require('ejs')
const path = require('path')
const express = require('express')
const app = new express()

mongoose.connect('mongodb://localhost/my_database', { useNewUrlParser: true} )

app.use(fileUpload())

app.listen(4000, () => {
  console.log('App listening on port 4000')
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use(express.static('public'))

app.set('view engine', 'ejs')

app.get('/', async (req, res) => {
  const blogposts = await BlogPost.find({})
  res.render('index', {
  blogposts
  });
})

app.get('/about', (req, res) => {
  res.render('about')
})

app.get('/post/:id', async (req, res) => {
  const blogpost = await BlogPost.findById(req.params.id)
  res.render('post', {
    blogpost})
})

app.get('/contact', (req, res) => {
  res.render('contact')
})

app.get('/posts/new', (req,res) => {
  res.render('create')
})

app.post('/posts/store', (req, res) => {
  let image = req.files.image;
  image.mv(path.resolve(__dirname, 'public/img', image.name))
  BlogPost.create(req.body)
  res.redirect('/')
})

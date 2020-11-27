//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const md5 = require("md5");
const path = require('path');

const homeStartingContent = "Are you afraid of programming and Data Structures? The C Programming Newsletter is here to help you. We post many programs and inportant topics here, on this website regularly, to ensure that our readers get the best and concise content.So get ready to learn. We will help you whether it be your Semester Exams or be your Competitive exam. Our Newsletter website will always help you.";
const aboutContent = "We are The C Programming Newsletter. Run by Shubham Khandelwal, a Computer Science Graduation pursuing student from IIIT KOTA. You can reach him through linkedin, click to the link mentioned below.";
const contactContent = "I am available on linkedIn as well as on Github. You can contact me there.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect(" < Enter MongoDB connection String here > ", {useNewUrlParser: true});


const postSchema = {
  title: String,
  content: String,
  username: String,
  password: String
};


const Post = mongoose.model("Post", postSchema);

app.get("/logout",function(req, res){
  res.redirect("/");
})

app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

app.get("/download",function(req,res){
  var file = req.params.file;
  var fileLocation = path.join('./','app.js');
  res.download(fileLocation,file);
});


app.get("/login", function(req, res){
  res.render("login");
});

app.get("/compose", function(req, res){
  res.redirect("/login");
});

app.post("/login", function(req,res){

  const username = req.body.username;
  const password = md5(req.body.password);

  Post.findOne({username: username} , function(err, foundUser){
    if(err){
      console.log(err);
    }
    else{
      if(foundUser){
        if(foundUser.password === password){
          res.render("compose");
        }
        else{
          res.render("loginerror");
        }
      }
      else{
        res.render("loginerror");
      }
    }
  });

});



app.get("/home",function(req,res) {
  res.redirect("/");
});


app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  app.get("/another", function(req,res){
    res.render("compose");
  });


  post.save(function(err){
    if (!err){
        res.render("success");
    }
  });
});

app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("*", function(req,res){
  res.render("error");
});



let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.listen(port, function() {
  console.log("Server has started successfully.");
});

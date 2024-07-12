import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";

const app=express();
const port=3000;
var id=0;
let blogList=[];
const __dirname=dirname(fileURLToPath(import.meta.url));

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended:true}));


app.get("/",(req,res)=> {
    res.render(__dirname+"/views/index.ejs",{blogList:blogList});
});


app.get("/createblog",(req,res) => {
    res.render(__dirname+"/views/createblog.ejs");
});

app.get("/edit/:id", (req, res) => {
    const blogId = req.params.id;
    const blogDetails = blogList.find((blog) => blog.id === parseInt(blogId));
    res.render(__dirname+"/views/createblog.ejs", {
      isEdit: true,
      blogDetails: blogDetails,
    });
  });


  app.get("/delete/:id", (req, res) => {
    const blogId = req.params.id;
    blogList = blogList.filter((blog) => blog.id !== parseInt(blogId));
    res.send(
        '<script>alert("Blog deleted successfully"); window.location="/";</script>'
    );
  res.redirect("/");
  });


app.post("/edit/:id", (req, res) => {
const blogId = req.params.id;
const editBlog = blogList.findIndex((blog) => blog.id === parseInt(blogId));
if (editBlog === -1) {
    res.send("<h1> Something went wrong </h1>");
}
const updatedTitle = req.body.title;
const updatedDescription = req.body.content;

const blogTitle = (blogList[editBlog].title = updatedTitle);
const blogDescription = (blogList[editBlog].content = updatedDescription);
[...blogList, { title: blogTitle, content: blogDescription }];

res.render(__dirname+"/views/index.ejs", {
    isEdit: true,
    blogList: blogList,
});
});


app.post("/home",(req,res)=>{
    var blogTitle=req.body["title"];
    var blogContent=req.body["content"];
    blogList.push({
        "id":id,
        "title":blogTitle,
        "content":blogContent,
    });
    id+=1;
    res.render(__dirname+"/views/index.ejs",{blogList:blogList,});
    
});

app.get("/viewblog/:id", (req, res) => {
    var blogId = req.params.id;

    res.render(__dirname+"/views/viewblog.ejs", {blogDetails: blogList[blogId]});
  });



app.listen(port,(req,res) => {
    console.log("Listening on port "+port);
});
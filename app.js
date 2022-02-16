


const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);


app.route('/articles')
.get((req, res) => {
    Article.find((err, foundArticles) => {
        if(!err) res.send(foundArticles);
        else res.send(err);
    })
})
.post((req, res) => {
    if(req) {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save((err) => {
            if(!err) {
                res.send("Successfully added a new article.");
            }
            else {
                res.send(err);
            }
        });
    }
})
.delete((req, res) => {
    Article.deleteMany((err) => {
        if(!err) {
            res.send('Successfully deleted all articles.');
        }
        else {
            res.send(err);
        }
    });
});


app.route('/articles/:articleTitle')
.get((req,res) => {
    Article.findOne({'title' : req.params.articleTitle}, (err, foundArticle) => {
        if(foundArticle) {
            res.send(foundArticle);
        }
        else {
            res.send('No article matching that title.');
        }
    });
})
.put((req, res) => {
    Article.replaceOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        (err) => {
            if(!err) {
                res.send("Successfully updated article.");
            }
        }
    );
})
.patch((req, res) => {
    Article.findOne({'title': req.params.articleTitle}, (err, foundArticle) => {
        if(foundArticle) {
            foundArticle.overwrite(req.body);
            foundArticle.save();
            res.send(foundArticle);
        }
        else {
            res.send("Couldn't Update");
        }
    });
})
.delete((req, res) => {
    Article.deleteOne({'title': req.params.articleTitle}, (err) => {
        if(!err) {
            res.send('Successfully deleted.');
        }
        else {
            res.send(err);
        }
    });
});









const PORT = 3000;

app.listen(3000, () => {
    console.log(`Server started on port ${PORT}`);
});
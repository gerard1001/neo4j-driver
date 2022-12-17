var express = require("express");
var path = require("path");
var logger = require("morgan");
const bodyParser = require("body-parser");
const neo4j = require("neo4j-driver");

var app = express();

//View engine
app.set("views", path.join(__dirname, "views")); //We are connecting our server to the fles in the folder of views
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

var driver = neo4j.driver(
  "bolt://localhost",
  neo4j.auth.basic("neo4j", "ruta1001")
);

var session = driver.session();

app.get("/", (req, res) => {
  session
    .run("MATCH (n:BOOK) RETURN n")
    .then((result) => {
      var bookArr = [];
      result.records.forEach((record) => {
        bookArr.push({
          id: record._fields[0].identity.low,
          title: record._fields[0].properties.title,
          author: record._fields[0].properties.author,
        });
      });

      session
        .run("MATCH (n:READER) RETURN n")
        .then((result) => {
          var readerArr = [];
          result.records.forEach((record) => {
            readerArr.push({
              id: record._fields[0].identity.low,
              name: record._fields[0].properties.name,
              age: record._fields[0].properties.age.low,
            });
          });
          res.render("index", { books: bookArr, readers: readerArr });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/reader/post", (req, res) => {
  const name = req.body.name;
  const age = req.body.age;

  session
    .run(`CREATE (n:READER {name: "${name}" , age: ${age}}) RETURN n`)
    .then((result) => {
      res.redirect("/");
      // session.close();
    })
    .catch((err) => {
      console.log(err);
    });

  console.log(name);
});

app.post("/book/post", (req, res) => {
  const title = req.body.title;
  const author = req.body.author;

  session
    .run(`CREATE (n:BOOK {title: "${title}" , author: "${author}"}) RETURN n`)
    .then((result) => {
      res.redirect("/");
      // session.close();
    })
    .catch((err) => {
      console.log(err);
    });
  // res.redirect("/");
  console.log(title, author);
});

app.post("/book/reader/post", (req, res) => {
  const title = req.body.title;
  const reader = req.body.reader;
  const date = req.body.date;

  session
    .run(
      `MATCH (n:BOOK {title: "${title}"}), (p:READER {name: "${reader}"}) CREATE (p) -[r:RETURNED {date: "${date}"}] -> (n) RETURN n`
    )
    .then((result) => {
      res.redirect("/");
      // session.close();
    })
    .catch((err) => {
      console.log(err);
    });
  // res.redirect("/");
});

//connect to port
app.listen(4050, () => {
  console.log("app listening on port 4050 🚀🚀🚀");
});

module.exports = app;

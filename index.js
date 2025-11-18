const { faker } = require('@faker-js/faker');
const mysql = require("mysql2");
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require('method-override');


// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "quora",
  password: "982678"
});


//show no of user in DB
app.get("/", (req, res) => {
  let q = `SELECT count(*) FROM user`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let count = result[0]["count(*)"];
      res.render("home.ejs", { count });
    });
  } catch (err) {
    console.log(err);
    res.send("there some pronlem");
  }
});

//show users(email , user )
app.get("/user", (req, res) => {
  let q = `SELECT * FROM user`;
  try {
    connection.query(q, (err, users) => {
      if (err) throw err;
      res.render("show.ejs", { users });
    });
  } catch (err) {
    console.log(err);
    res.send("there some pronlem");
  }
});

//Edit username (form serving)
app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id = '${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      res.render("edit.ejs", { user });
    });
  } catch (err) {
    console.log(err);
    res.send("there some pronlem");
  }

});

//update username 
app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  let { username: newUsername, password: formPass } = req.body;
  let q = `SELECT * FROM user WHERE id = ?`;
  try {
    connection.query(q, [id], (err, result) => {
      if (err) throw err;

      const user = result[0];
      console.log(user);

      // if (formPass != user.password) {
      //   res.send("Wrong passward");
      // }

      const newPass = String(formPass ?? '').trim();
      const dbPass = String(user.password ??  '').trim();
      if ( newPass !== dbPass) {
        return res.send("Wrong password");
      }

      else {
        // let q2 = `UPDATE user SET username='${newUsername}' WHERE id=${id}`;
        // connection.query(q2, (err, result) => {
        //   if (err) throw err;
        // return res.redirect("/user"); 
        // });



        connection.query("UPDATE user SET username = ? WHERE id = ?", [newUsername, id], (err, result) => {
          if (err) throw err;
          return res.redirect("/user");   // send a response on success
        });

      }
    });
  } catch (err) {
    console.log(err);
    res.send("there some pronlem");
  }
});


app.listen("3000", () => {
  console.log("server is working")
}
);












// //Insert new data
// let q = "INSERT INTO user (id, username, email, passward) VALUES ?";
// let user = [
//   [120, "priitsh", "this@gmail.com", "abc"],
//   [150, "Ratindra", "jidjs@gmail.com", "djoj"],
//   [665, "Navo", "isjsi@gmail.com", "sdsd"]
// ];


// try{
// connection.query(q, [user], (err, result) => {
//     if(err) throw err;
//     console.log(result);
// });
// } catch(err){
//   console.log(err);
// }

// connection.end();


// getRandomUser = () => {
//   return {
//     userId: faker.string.uuid(),
//     username: faker.internet.username(),
//     email: faker.internet.email(),
//     password: faker.internet.password()
//   };
// }

//Insert bult fake data


// Users = () => {
//   return [
//     faker.string.uuid(),
//     faker.internet.username(),
//     faker.internet.email(),
//     faker.internet.password()
//   ];
// };

//  let q = "INSERT INTO user (id, username, email, passward) VALUES ?";
//  let data = [];

//  for(let i=1; i<=100; i++){
// data.push(Users());
// };


// try{
// connection.query(q, [data], (err, result) => {
//     if(err) throw err;
//     console.log(result);
// });
// } catch(err){
//   console.log(err);
// }

// connection.end();
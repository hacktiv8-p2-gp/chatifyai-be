const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const AuthController = require("./controllers/AuthController");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/login", AuthController.login);

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

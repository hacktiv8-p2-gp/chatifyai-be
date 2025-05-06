const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const AuthController = require("./controllers/AuthController");
const errorHandler = require("./middlewares/ErrorMiddlewares");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/login", AuthController.login);
app.post("/register", AuthController.register);

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

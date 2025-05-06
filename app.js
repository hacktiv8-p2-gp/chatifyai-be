const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const errorHandler = require("./middlewares/ErrorMiddlewares");
const AuthRouter = require("./routers/AuthRouter");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/auth", AuthRouter);
// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

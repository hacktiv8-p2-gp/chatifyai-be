const admin = require("firebase-admin");
const ResponseError = require("../helpers/ResponseError");
var serviceAccount = require("../hacktiv8-p2-gp-741fe-firebase-adminsdk-fbsvc-bf614a820b.json");
admin.initializeApp({
  projectId: process.env.PROJECT_ID,
  credential: admin.credential.cert(serviceAccount),
});

function extractToken(authHeader) {
  if (!authHeader) {
    throw new ResponseError("No token provided", 401);
  }

  const splittedToken = authHeader.split(" ");

  if (splittedToken.length !== 2 || splittedToken[0] !== "Bearer") {
    throw new ResponseError("Token format is invalid", 401);
  }

  return splittedToken[1];
}

async function AuthMiddleware(req, res, next) {
  const token = extractToken(req.headers["authorization"]);

  if (!token) {
    throw new ResponseError("Token invalid", 401);
  }

  let payload;
  try {
    payload = await admin.auth().verifyIdToken(token);
  } catch (e) {
    console.log(e);
    throw new ResponseError("Token invalid", 401);
  }
  req.user = payload;

  next();
}

module.exports = { AuthMiddleware, admin };

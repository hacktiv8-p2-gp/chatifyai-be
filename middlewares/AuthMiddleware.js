const admin = require("firebase-admin");
const ResponseError = require("../helpers/ResponseError");
admin.initializeApp({
  projectId: "hacktiv8-p2-gp-741fe",
});

async function AuthMiddleware(req, res, next) {
  if (!req.headers?.authorization?.startsWith("Bearer ")) {
    throw new ResponseError("Token invalid", 401);
  }

  const idToken = req.headers.authorization.split("Bearer ")[1];

  let payload;
  try {
    payload = await admin.auth().verifyIdToken(idToken);
  } catch (e) {
    throw new ResponseError("Token invalid", 401);
  }
  req.user = payload;

  next();
}

module.exports = { AuthMiddleware, admin };

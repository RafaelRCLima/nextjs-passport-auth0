const express = require("express");
const passport = require("passport");

const router = express.Router();

router.get("/login", passport.authenticate("auth0", {
  scope: "openid email profile"
}), (req, res) => res.redirect("/"));

router.get("/callback", (req, res, next) => {
  passport.authenticate("auth0",  (err, user) => {
    if (err) return next(err);
    if (!user) {
      console.log('Não tem usuário')
      return res.redirect("/login")
    };
    req.logIn(user, (err) => {
      console.log(JSON.stringify(user.displayName))
      if (err) return next(err);
      res.redirect("/");
    });
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logout();

  const {AUTH0_DOMAIN_PASS, AUTH0_CLIENT_ID_PASS, BASE_URL_PASS} = process.env;
  res.redirect(`https://${AUTH0_DOMAIN_PASS}/logout?client_id=${AUTH0_CLIENT_ID_PASS}&returnTo=${BASE_URL_PASS}`);
});

module.exports = router;
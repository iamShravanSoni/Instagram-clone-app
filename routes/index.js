var express = require("express");

var router = express.Router();
const usermodel = require("./users");
const postmodel = require("./posts");
const passport = require("passport");
const localStrategy = require("passport-local");
const upload = require("./multer");
passport.use(new localStrategy(usermodel.authenticate()));

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("register");
});

router.get("/home", isLoggedIn, async function (req, res) {
  const posts = await postmodel.find().populate("user");
  res.render("home", { posts });
});

router.get("/profile", isLoggedIn, async function (req, res, next) {
  const user = await usermodel
    .findOne({ username: req.session.passport.user })
    .populate("posts");
  res.render("profile", { user });
});

router.get("/edit", isLoggedIn, async function (req, res) {
  const user = await usermodel.findOne({ username: req.session.passport.user });
  res.render("edit", { user });
});

router.post(
  "/edituploads",
  isLoggedIn,
  upload.single("avatar"),
  async function (req, res) {
    const user = await usermodel.findOneAndUpdate(
      { username: req.session.passport.user },
      {
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        bio: req.body.bio,
      },
      { new: true }
    );
    if (req.file) {
      user.profileimage = req.file.filename;
    }
    await user.save();
    res.redirect("/profile");
  }
);

router.get("/create", isLoggedIn, function (req, res) {
  res.render("create");
});

router.post(
  "/createuploads",
  isLoggedIn,
  upload.single("image"),
  async function (req, res) {
    const user = await usermodel.findOne({
      username: req.session.passport.user,
    });
    const post = await postmodel.create({
      picture: req.file.filename,
      user: user._id,
      caption: req.body.caption,
    });
    user.posts.push(post._id);
    await user.save();
    res.redirect("/home");
  }
);

router.get("/search", isLoggedIn, function (req, res) {
  res.render("search");
});

router.get("/username/:username", isLoggedIn, async function (req, res) {
  const regex = new RegExp(`^${req.params.username}`, "i");
  const users = await usermodel.find({ username: regex });
  res.json(users);
});

router.get("/login", function (req, res, next) {
  res.render("login", { error: req.flash("error") });
});

router.post("/register", function (req, res, next) {
  const { username, email, firstname, lastname } = req.body;
  const user = new usermodel({ username, email, firstname, lastname });

  usermodel.register(user, req.body.password).then(function () {
    passport.authenticate("local")(req, res, function () {
      res.redirect("/profile");
    });
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
  }),
  function (req, res) {}
);

router.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

module.exports = router;

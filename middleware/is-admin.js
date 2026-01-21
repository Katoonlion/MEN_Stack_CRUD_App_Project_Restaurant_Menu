module.exports = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/auth/sign-in');
  }

  if (req.session.user.role !== 'admin') {
    return res.sendStatus(403).send('Admins only');;
  }

  next();
};


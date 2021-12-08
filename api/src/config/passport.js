const passport = require('passport');
const passportJwt = require('passport-jwt');

const secret = 'APIMARCOPINTO';

const { Strategy, ExtractJwt } = passportJwt;

module.exports = (app) => {
  const params = {
    secretOrKey: secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  };

  const strategy = new Strategy(params, (load, done) => {
    app.services.technician.find({ id: load.id })
      .then((technician) => {
        if (technician) done(null, { ...load });
        else done(null, false);
      })
      .catch((err) => done(err, false));
  });

  passport.use(strategy);

  return {
    authenticate: () => passport.authenticate('jwt', { session: false }),
  };
};

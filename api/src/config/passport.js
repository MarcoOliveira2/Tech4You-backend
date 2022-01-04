const passport = require('passport');
const passportJwt = require('passport-jwt');

const secret = 'APIMARCOPINTO';

const { Strategy, ExtractJwt } = passportJwt;

module.exports = (app) => {
  const params = {
    secretOrKey: secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  };

  const strategy = new Strategy(params, (payload, done) => {
    app.services.technician.find({ id: payload.id })
      .then((technician) => {
        if (technician) done(null, { ...payload });
        else done(null, false);
      })
      .catch((err) => done(err, false));
  });

  passport.use(strategy);

  return {
    authenticate: () => passport.authenticate('jwt', { session: false }),
  };
};

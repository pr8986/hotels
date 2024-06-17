// sets up Passport with a local authentication strategy, using a Person model for user data. - Auth.js file

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Person = require('./models/Person'); // Adjust the path as needed

passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        // console.log('Received credentials:', username, password);
        const user = await Person.findOne({username});
        if (!user)
            return done(null, false, { message: 'Incorrect username.' });
        
        //  const isPasswordMatch = user.password === password? true:false;
       const isPasswordMatch = await user.comparePassword(password);
        if (isPasswordMatch)
            return done(null, user);
        else{
            console.log("here")
            return done(null, false, { message: 'Incorrect password.' })

        }
    } catch (error) {
        return done({ message: 'Incorrect password.' });
    }
}));

module.exports = passport; // Export configured passport









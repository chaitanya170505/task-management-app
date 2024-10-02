import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport';
import routes from './routes.js'; 
import authRoutes from './auth.js'; 
import dotenv from 'dotenv';
dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
    session({
        secret:"process.env.SESSION_SECRET",
        resave:false,
        saveUninitialized:true,
    })
)

app.use(passport.initialize());
app.use(passport.session());

app.use('/', authRoutes); 

app.use('/', routes);

app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/user');
    } else {
        res.redirect('/login');
    }
});

app.listen(PORT, () => {
  console.log(`App is listening at :${PORT}`);
});

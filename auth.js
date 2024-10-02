import express from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt';
import { Strategy as LocalStrategy } from 'passport-local';
import db from './db.js';

const router = express.Router();
const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 10;


passport.use(new LocalStrategy(async function verify(username, password, cb) {
  try {
    const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedHashedPassword = user.password;
      bcrypt.compare(password, storedHashedPassword, (err, valid) => {
        if (err) {
          return cb(err);
        }
        if (valid) {
          return cb(null, user);
        } else {
          return cb(null, false);
        }
      });
    } else {
      return cb(null, false, { message: 'User not found' });
    }
  } catch (err) {
    return cb(err);
  }
}));

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
  try {
    const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    
    if (result.rowCount > 0) {
      const user = result.rows[0]; 
      cb(null, user); 
    } else {
      cb(new Error('User not found')); 
    }
  } catch (err) {
    cb(err); 
  }
});



router.post('/login', passport.authenticate('local', {
  successRedirect: '/user',
  failureRedirect: '/login',
}));

router.post('/register', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;

  try {
    const checkResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);

    if (checkResult.rows.length > 0) {
      res.redirect('/login');
    } else {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.error('Error hashing password:', err);
        } else {
          const result = await db.query('INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING id', [email, username, hash]);
          const user = result.rows[0];

          const newUserId = result.rows[0].id;

          // Insert default lists for the new user
          const defaultLists = ['Work', 'Personal'];
          for (const listName of defaultLists) {
            await db.query('INSERT INTO lists (list, userid) VALUES ($1, $2)', [listName, newUserId]);
          }


          req.login(user, (err) => {
            if (err) {
              console.error('Error logging in user:', err);
              res.redirect('register');
            } else {
                console.log("success");
                res.redirect("/user");
            }
          });
        } 
      });
    }
  } catch (err) {
    console.error(err);
  }
});

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      else{
        res.redirect('/');
      }   
    });
  });

export default router;

import express from 'express';
import bodyParser from 'body-parser';
import db from './db.js'; 
import { getUserInfo, getAllTasks, getUpcomingTasks, getOverdueTasks, getCompletedTasks, getTasksForList, getAllListsForUser, getAllTasksCount } from './functions.js';

const router = express.Router();



//funcitn to check the authentication for each route
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); 
  }
  res.redirect('/login'); 
}

//login and registration routes 
router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/register', (req, res) => {
  res.render('register');
});




//users routre i,e home page some overview is there
router.get('/user', isAuthenticated, async (req, res) => {
  try {
    const { usermail, username } = await getUserInfo(req);
    const lists = await getAllListsForUser(req); 

    res.render('add-task', {
      lists:lists,
      username: username,
      usermail: usermail
    });
  } catch (err) {
    console.error("Error fetching user email:", err);
    res.status(500).send("An error occurred while fetching user information.");
  }
});

/* route to handle add new task */
router.post('/add-task', isAuthenticated, async (req, res) => {
  const { heading, description, priority, category } = req.body;
  const completionDate = req.body['completion-date'];

  if (!heading || !description || !priority || !category || !completionDate) {
    return res.status(400).send('All fields are required.');
  }

  try {

    const userid = req.user.id;

    await db.query(
      'INSERT INTO tasks (userid, title, description, due_date, priority, listid) VALUES ($1, $2, $3, $4, $5, $6)',
      [userid, heading, description, completionDate, priority, category]
    );

    res.redirect(req.get('Referer'));
  } catch (err) {
    console.error('Error adding task:', err);
    res.status(500).send('Error adding task.');
  }
});


//route to get the dashboard 
router.get('/dashboard',isAuthenticated, async (req, res) => {
  try {
    const { usermail, username } = await getUserInfo(req);
    const lists = await getAllListsForUser(req); 

    const totalTasks = await getAllTasksCount(req);
    const upcomingTasks = await getUpcomingTasks(req);
    const completedTasks = await getCompletedTasks(req);
    const overdueTasks = await getOverdueTasks(req);

    res.render('dashboard', {
      lists:lists,
      username: username,
      usermail: usermail,
      totalCount: totalTasks.length,
      upcomingCount: upcomingTasks.length,
      completedCount: completedTasks.length,
      overdueCount: overdueTasks.length
    });
  } catch (err) {
    console.error("Error fetching user email:", err);
    res.status(500).send("An error occurred while fetching user information.");
  }
});


router.get('/tasks/:type', isAuthenticated, async (req, res) => {
  const taskType = req.params.type;
  let tasks;

  // i am gonna use if conditions to handle differnt routes
  if (taskType === 'all') {
    tasks = await getAllTasks(req);
  } else if (taskType === 'upcoming') {
    tasks = await getUpcomingTasks(req);
  } else if (taskType === 'completed') {
    tasks = await getCompletedTasks(req);
  } else if (taskType === 'overdue') {
    tasks = await getOverdueTasks(req);
  } else {
    return res.redirect('/');
  }

  // now its simple i just need to send the task once for all the routes
  const { usermail, username } = await getUserInfo(req);
  const lists = await getAllListsForUser(req); 
  
  res.render('getTasks',
     {
       lists:lists,
       tasks:tasks,
       username: username,
       usermail: usermail
      });
});


//mark the task completed route

router.post('/complete-task/:id', isAuthenticated, async (req, res) => {
  const taskId = req.params.id; 

  try {
    await db.query("UPDATE tasks SET completed = TRUE WHERE id = $1", [taskId]);

    res.redirect(req.get('Referer'));
  } catch (err) {
    console.error("Error marking task as completed:", err);
    res.status(500).send("An error occurred while marking the task as completed.");
  }
});

//route to get tasks based on the list
router.get('/lists/:listId', isAuthenticated, async (req, res) => {
  const listId = req.params.listId;

  try {
    const { usermail, username } = await getUserInfo(req);
    const lists = await getAllListsForUser(req);
    const tasks = await getTasksForList(req.user.id, listId); 
    res.render('getTasks', { 
       lists:lists,
       tasks:tasks,
       username: username,
       usermail: usermail
    }); 
  } catch (err) {
    console.error("Error fetching tasks for the list:", err);
    res.status(500).send("An error occurred while fetching tasks for the list.");
  }
});


//route to add new list to the user
router.post('/add-list', isAuthenticated, async (req, res) => {
  const listName = req.body['list-name'];
  const userId = req.user.id; 

  try {
    //inserting into the list table correcsponding to the userid
    await db.query("INSERT INTO lists (list, userid) VALUES ($1, $2)", [listName, userId]);
    res.redirect(req.get('Referer'));
  } catch (err) {
    console.error("Error adding new list:", err);
    res.status(500).send("An error occurred while adding the new list.");
  }
});


//route to delete dast from the database
router.post('/delete-task/:id', isAuthenticated, async (req, res) => {
  const taskId = req.params.id;
  const userId = req.user.id; 
  try {
    await db.query("DELETE FROM tasks WHERE id = $1 AND userid = $2", [taskId, userId]);

    res.redirect(req.get('Referer'));
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).send("An error occurred while deleting the task.");
  }
});



//route to handle edit profile's post request
router.post('/edit-profile', isAuthenticated, async (req, res) => {
  const { username, usermail } = req.body; 
  const userId = req.user.id; 

  try {
    await db.query(
      "UPDATE users SET username = $1, email = $2 WHERE id = $3",
      [username, usermail, userId]
    );
    res.redirect(req.get('Referer'));
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).send("An error occurred while updating the profile.");
  }
});


// and finally sign out route
router.get('/sign-out', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err); 
    }
    res.redirect('/'); 
  });
});


export default router;

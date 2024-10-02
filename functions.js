import db from './db.js';

//function to get the userinfo
async function getUserInfo(req) {
      const result = await db.query("SELECT * FROM users WHERE id = $1", [req.user.id]);
      const user = result.rows[0] || {};
      return { usermail: user.email || '', username: user.username || '' };
}

//function to get all the tasks (incomplete)
async function getAllTasks(req) {
    const result = await db.query(`SELECT tasks.*, lists.list AS list_name FROM tasks INNER JOIN lists ON tasks.listid = lists.id WHERE tasks.userid = $1 AND tasks.completed = FALSE ORDER BY tasks.due_date ASC`,[req.user.id]);
    return result.rows;
}

//functin to get the upcoming tasks (incomplete)
async function getUpcomingTasks(req) {
    const result = await db.query(`SELECT tasks.*, lists.list AS list_name FROM tasks INNER JOIN lists ON tasks.listid = lists.id WHERE tasks.userid = $1 AND tasks.completed = FALSE AND tasks.due_date BETWEEN DATE_TRUNC('day', CURRENT_TIMESTAMP) AND (CURRENT_TIMESTAMP + INTERVAL '1 week') ORDER BY tasks.due_date ASC`,[req.user.id]);
    return result.rows;
}

//function to get the overdue tasks (incomplete)
async function getOverdueTasks(req) {
    const result = await db.query(`SELECT tasks.*, lists.list AS list_name FROM tasks INNER JOIN lists ON tasks.listid = lists.id WHERE tasks.userid = $1 AND tasks.completed = FALSE AND tasks.due_date < CURRENT_DATE ORDER BY tasks.due_date ASC`,[req.user.id]);
    return result.rows;
}

//function to get all the complete tasks
async function getCompletedTasks(req) {
    const result = await db.query(`SELECT tasks.*, lists.list AS list_name FROM tasks INNER JOIN lists ON tasks.listid = lists.id WHERE tasks.userid = $1 AND tasks.completed = TRUE ORDER BY tasks.due_date ASC`,[req.user.id]);
    return result.rows;
}

//function to get tasks based on the list selection
async function getTasksForList(userId, listId) {
    const result = await db.query(`SELECT tasks.*, lists.list AS list_name FROM tasks INNER JOIN lists ON tasks.listid = lists.id WHERE tasks.userid = $1 AND tasks.listid = $2 AND tasks.completed = FALSE  ORDER BY tasks.due_date ASC`,[userId, listId]);
    return result.rows;
}

//function to get all the lists of the user
async function getAllListsForUser(req) {
    const result = await db.query("SELECT * FROM lists WHERE userid = $1 ORDER BY list ASC",[req.user.id]);
    return result.rows; 
}

//function to get the total number of tasks
async function getAllTasksCount(req) {
    const result = await db.query(`SELECT tasks.*, lists.list AS list_name FROM tasks INNER JOIN lists ON tasks.listid = lists.id WHERE tasks.userid = $1 ORDER BY tasks.due_date ASC`,[req.user.id]);
    return result.rows;
}

export { getUserInfo, getAllTasks, getUpcomingTasks, getOverdueTasks, getCompletedTasks, getTasksForList, getAllListsForUser, getAllTasksCount };

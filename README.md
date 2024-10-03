# Task Management Website

A full-stack web application for users to create, manage, and track their tasks efficiently. This application provides functionalities like task categorization, completion tracking, and user authentication with a clean, responsive interface.

## Features

- **User Authentication**: Secure login and registration using Passport.js.
- **Task Management**: Users can create and delete tasks, assign priorities, and set due dates.
- **Task Categories**: Tasks are organized into different lists (e.g., Work, Personal) for better management.
- **Task Filtering**: Filter tasks by status—upcoming, completed, overdue, or incomplete.
- **Responsive Design**: The website is fully responsive, offering a seamless user experience on both desktop and mobile devices.

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript, EJS
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: Passport.js
- **Version Control**: Git
- **Deployment**: Render

## Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/chaitanya170505/task-management-app.git
    ```
2. **Install dependencies**:
    ```bash
    npm install
    ```
3. **Set up environment variables(for local development)**:
    Create a `.env` file and add the following:
    ```bash
    DB_USER=your_db_username
    DB_PASSWORD=your_db_password
    DB_NAME=your_db_name
    SESSION_SECRET=your_session_secret
    ```

4. **Run the application**:
    ```bash
    npm start
    ```

5. **Access the website**:
    Open your browser and navigate to `http://localhost:3000`.

## Usage

- Register a new account or log in if you already have one.
- Add tasks to different lists and track their progress.
- Mark tasks as completed, view upcoming tasks, or review overdue tasks.



# Real-Time Expression Analysis Coach
AI-powered facial emotion analysis application that provides real-time coaching for approachable appearance, built using Next.JS and Django.

## Installation
There are 2 components to this project: the frontend and the backend.
To start up the frontend server:
```
> cd frontend
> npm install                       -- install required dependencies
> npm run dev                       -- start up the Next.js server
```
A `localhost` server should be booted up.

To start the backend server:
(new terminal window)
```
> cd backend
> python -m pyenv                   -- create python virtual environment
> pip install requirements.txt      -- install required dependencies
> python manage.py runserver        -- start up the Django server
```
Another `localhost` server should be booted up (on a different port).

Set up is complete! Simple head over to `http://localhost:<port number>` (Port number usually `3000`).

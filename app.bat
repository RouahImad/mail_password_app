@echo off

start cmd /k "echo Running the server script... && cd server && npm run dev"

start cmd /k "echo Running the client script... && cd client && npm run dev"
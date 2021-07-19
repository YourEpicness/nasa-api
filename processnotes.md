# Notes on Express Workflow

MVC method
- models, views, controllers
- views aren't needed this project due to client-server architecture w/ client provided
- controllers are stored with routes for easier access

Models:
- We hold our data in the models

Controller: 
- We hold all our functions for retrieving data in controller

Routes:
- We combine model and routes to be exported to the app.js

Routers and controllers are grouped together because they are one to one. Models can be used variously throughout controllers. Could be one model to many or many to one.

Node won't wait for stream code. Need an asynchronous solution. Solution: create a JS promise and wait for it to resolve. 

To run both client and servers at same time in dev use:
    "server": "npm run dev --prefix server",
    "client": "npm start --prefix client",
    "dev": "npm run server & npm run client"
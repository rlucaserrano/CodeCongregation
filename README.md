# CodeCongregation
UF Fall 2024 Senior Project
Test

# CodeCongregation
UF Fall 2024 Senior Project

# Technologies Used
Reactjs: 
Includes frontend libraries for building frontend single-page applications

Flask:  
Backend micro-framework written in Python for development process

Useful for simplicity and independence

Frontend and Backend Communicate through HTTP request


Set-Up Instructions frontend:

run command :

    npx create-vite

select framework: React
select variant: JavaScript

run commands:

    cd client

    npm install [ to install dependencies]

    npm install axios
        fetch API requests to servers

    npm install react-router-dom  
        so we can create multiple webpages  



start front-end application by running command:   
    npm run dev


Set-up Instructions backend:
commands: 

    mkdir server 
        to make server directory

    cd server

    python3 -m venv venv
        to create virtual environment 

    source venv/bin/activate
        to activate virtual environment

    pip3 install Flask
        install Flask dependency

    pip3 install Flask-CORS              

run application:

    cd server
    python3 main.py


Notes to self:
    App.jsx
        where I am routing the web pages


Implementing Google Oauth2
Resource Used: 
 
created OAuth client created

    npm install @react-oauth/google@latest
    create server/.env + client/.env
    go onto the google cloud console --> copy the client ID + client secret

    client/.env
    VITE_GOOGLE_CLIENT_ID= <Paste_CLIENT_ID_>

    server/.env
    GOOGLE_CLIENT_ID=<Paste_CLIENT_ID_>
    GOOGLE_SECRET_KEY=<Paste_SECRET_KEY>






    



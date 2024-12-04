

# CoderCongregation
UF Fall 2024 Senior Project:
The primary aim of our project is to facilitate computer science learning through the development of an educational website. To this aim, CoderCongregation allows users to join study groups to share resources, communicate with others, and plan study activities. Regarding resource sharing, users can access, modify, and organize shared websites for each study group they join. Additionally, users can explore community resources ranked by popularity to discover helpful educational websites. Furthermore, the sharing activity of each group is analyzed and resource recommendations are generated based on whether similar groups found the website helpful. 
As to user communication, CoderCongregation features integrated Discord and Zoom functionality to allow users to message and video conference with members of each of their study groups. Specifically, users can send messages to entire study groups or individual members. Also, users can access their Zoom accounts and join group meetings with the click of a button. Regarding activity planning, CoderCongregation facilitates structured learning through the implementation of calendar features and logged activity for each user. Specifically, users can create calendars for each study group they join to share availability and coordinate group activities.

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


Circle CI
    circleci config validate
    git add .circleci/config.yml


Oracle Database - add to .env file 
    
ORACLE_USER=ADD
ORACLE_PASSWORD=ADD
ORACLE_HOST=oracle.cise.ufl.edu
ORACLE_PORT=1521
ORACLE_SID=orcl

Session Set-up
    cd server
    pip install Flask-Session

 Create + Generate Flask Secret Key
    open a new terminal
run commands:
    python3
    import os
    import base64
    secret_key = base64.b64encode(os.urandom(24)).decode('utf-8')
    print(secret_key)

add to .env file : FLASK_SECRET_KEY=ADD


Setting up google calendars
in server dir
run command:
    pip install google-auth google-auth-oauthlib google-auth-httplib2 google-api-python-client

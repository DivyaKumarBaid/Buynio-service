# Auth using JWT in NESTJS
This is a micro service that contains basic auth 

## Introduction
This is a microservice built in nestjs as a base for authentication template. This microservice uses JWT tokens (access and refresh tokens)

#### Tech Stack
- NestJs
- Postgres
- Docker
- Prisma

## Working around
Development Server : 
- Clone the repo
- `npm install`
- `docker compose up -d`
- `npx prisma migrate dev`
- `npx prisma db push`
- `npm run start:dev`

### WorkFlow
- User will Sign-up either by email or by google
- If done by email
    - Users are asked for email, password, username
    - User is added to a table (collection) of unverified users and an email is sent containing otp
    - User is then redirected to otp page where they can provide otp and are moved to verified table
- If done by google
    - Users just signin using google and the access token from google.users is send to backend
    - If the user doesnt exist, they would be added directly to verified users table
    - Tf the user exist, they would be logged in directly
- On login, two tokens are provided : access token and refresh token
- For google loggedin users, the user object if first saved and then are provided for generation of access token and refresh token
- Password for google logged-in users are their token and saved as hashed part
- The refresh token is kept in database as hashed to verify user
- The validity of access token is kept as 15 mins and refresh token for 7 days
- After every 10min the access token is sent to `auth/refresh` to get new pair of tokens
- For logout, hashed refresh token is deleted from Database
- For resetting password, the auth controller has password reset api

### Notes 
- If the user has already logged in from google, they can log in from email but then need to reset password.
- For google logged in users, their would be a field signedInMethod and this is either local.com -> implying done with email or google.com implying done using google.
- If a user is logged in with a gmail as local i.e. using email, they can directly login using google signin method and will retain all info.


### Postman
[Title](Auth_base_template.postman_collection.json) contains all the routes required with example

## Run development environment

Required: \
MySQL 8 or MariaDB 10\
Visual Studio 2022 with ASP.NET and web development packages

### Create Database
```
CREATE DATABASE contactsnet;
```

### Set .ENV file
Within /api directory copy .env.example and set the DB connection string

### Apply migrations
Within /api directory run:
```
$ dotnet ef database update
```

### Start API
Start API using Visual Studio "Start Debugging" button

### Start web app
Within /frontend-contacts run the following commands:
```
$ npm install
$ npm run dev
```

### Expected result
After the application starts, navigate to `http://localhost:5173/register` in your web browser

## Run in production
1. Follow instructions in rahmedd/infra repo to setup base production environment and deploy

2. Set production .env vars

3. Create migration script using  ```dotnet ef migrations script -o ./init.sql```

4. Configure DB using SSH \
	a. Create database \
	b. Run init.sql script on database

5. Use docker contexts to deploy:
```
$ docker context create --docker "host=ssh://deployer@mydomain.test" prod
$ docker context use prod
$ docker compose up --build
```
### Expected Result 
After the application starts, navigate to `http://mydomain.test` in your web browser
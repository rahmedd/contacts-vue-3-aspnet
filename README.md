## Compose application


### ASP.NET server with an Nginx proxy and a MySQL database

Project structure:
```
.
├── api
│   ├── Dockerfile
│   ├── aspnet.csproj
│   └── Program.cs
├── db
│   └── password.txt
├── compose.yaml
├── frontend-contacts
│   ├── nginx.conf
│   └── Dockerfile
└── README.md
```

## Deploy with docker compose

```
$ docker compose up -d
```

## Expected result
After the application starts, navigate to `http://localhost:80` in your web browser:

Stop and remove the containers
```
$ docker compose down
```

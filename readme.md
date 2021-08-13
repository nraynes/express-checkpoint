User Stories.


As a client application consuming your api application,
I want to be able to receive a list of movies from the database,
so that I can list them on my interface.

As a client application consuming your application,
I want to be able to search by title for movies from the database,
so that I can list them on my interface.

As a client consuming application, I want to be able to receive an individual movie record from the database, so that I can display its data on my interface.

As a client consuming application, I want to be able to send a new movie record to the database, so that it can be available for my future use.

As a client consuming application, I want to be able to delete a movie record from the database, so that it is no longer an entry in the list of movies.




run these commands in the terminal to create a database:

In the terminal run: "docker run --name gmdb -e POSTGRES_PASSWORD=myPass -d -p 5432 postgres"

Enter the CLI for the database container.

login: "psql -U postgres"

create the database: "CREATE DATABASE gmdb;"

Then run from the normal terminal: "docker exec -i gmdb /bin/bash -c "PGPASSWORD=myPass psql --username postgres gmdb" < ./db/export.sql" from the repos directory.

change port in db.js to match port for database.
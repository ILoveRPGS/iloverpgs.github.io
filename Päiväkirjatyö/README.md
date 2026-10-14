# Päiväkirja (workout diary)

A school project from 2021: a workout diary written in PHP and MySQL with a hand-rolled MVC structure (a front controller in `index.php` that switches on `?action=`, controllers, models and views). Users can register, log in and log out, then add, edit and delete workout entries (exercise type, date, duration, calories, intensity and a short comment). It talks to MySQL through PDO and uses the tables `paivakirja`, `paivakirja_tyyppi` and `paivakirja_kayttaja`. There is no schema file in this repository, so you would have to recreate those tables yourself.

The original school server no longer exists, and GitHub Pages does not run PHP, so there is no live demo. This folder is source only.

## Running it yourself

You need PHP and a MySQL or MariaDB database that you control.

1. Create a database and the three tables listed above.
2. Copy `database/config.sample.php` to `database/config.php` and fill in your host, database name, user and password. `config.php` is git-ignored. If it is missing, the app stops with a short message that says so.
3. From this folder, start PHP's built-in server, for example `php -S localhost:8000`, and open it in a browser. The model files load `./database/connection.php` relative to the working directory, so start the server from here.

## What I would do differently now

Use prepared statements for every query (several here still build SQL from strings), escape all output, check that an entry belongs to the logged-in user before editing or deleting it, and add CSRF protection (deletes currently happen through plain GET links).

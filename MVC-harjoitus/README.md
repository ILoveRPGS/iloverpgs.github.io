# MVC-harjoitus (news posts, TreduLan 2021 course)

A 2021 PHP MVC exercise from a school course: register, log in, log out, and add, edit and delete news posts. It has the same structure as the workout diary: a front controller in `index.php` that switches on `?action=`, controllers, models and views. It talks to MySQL through PDO and uses the tables `kayttaja_uutinen` (users) and `uutinen` (news). There is no schema file in this repository, so you would have to recreate those tables yourself. Most model functions use prepared statements.

The original school server no longer exists, and GitHub Pages does not run PHP, so there is no live demo. This folder is source only. The `Kuvat/lantapahtuma.JPG` screenshot that used to sit on the old portfolio page shows the event-page design from the same course; the source for that page is not in this repository.

## Running it yourself

You need PHP and a MySQL or MariaDB database that you control.

1. Create a database and the two tables listed above.
2. Copy `database/config.sample.php` to `database/config.php` and fill in your host, database name, user and password. `config.php` is git-ignored. If it is missing, the app stops with a short message that says so.
3. From this folder, start PHP's built-in server, for example `php -S localhost:8000`, and open it in a browser. The model files load `./database/yhteys.php` relative to the working directory, so start the server from here.

## What I would do differently now

Use prepared statements for every query, escape all output, check that a post belongs to the logged-in user before editing or deleting it, and add CSRF protection to the edit and delete actions.

# iloverpgs.github.io

Portfolio of Mitja Savijärvi, software developer and student in Tampere, Finland. Live at https://iloverpgs.github.io/ (a GitHub Pages user site: the repository root is the site root, branch `master`).

There is no build step, no bundler and no framework. The site is plain HTML, CSS and JavaScript, and everything in the repository is meant to be edited by hand.

## How the repository is organised

New site:

- `index.html`: the whole portfolio as eight slides in this order (`#hello`, `#path`, `#skills`, `#trinketbot`, `#architecture`, `#numbers`, `#how-i-work`, `#learning-curve`), all text plain HTML, plus the shell (top bar, command console, footer line).
- `assets/css/`: `fonts.css` and `site.css` (design tokens are CSS custom properties at the top of `site.css`; it has a table of contents).
- `assets/js/main.js`: the slideshow engine: the pace table, the opening, the console and boot log, history and deep links, keyboard, the mobile menu, the animation switch and the contact address. It uses GSAP core only.
- `assets/img/`, `assets/fonts/`, `assets/vendor/`: images, self-hosted fonts and the vendored GSAP. Nothing is loaded from a CDN. The icons (`favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`) and the share image `og.jpg` are drawn from the slash-and-cursor mark, see "The mark and where the Trinket appears" below.
- `404.html`, `Harjoitus7.html` (a redirect stub for an old public URL), `.nojekyll` and `licenses.txt`.

Legacy school work, kept in place on purpose so that old links keep working:

- `fanikauppa/`: a React 17 shop prototype (built files). It uses absolute `/fanikauppa/...` asset paths, so it must stay at that path.
- `index_tiedostot/` and `css/`: HTML and CSS exercises from 2020. `Harjoitus7.html` is the one linked from the portfolio. Several of the other pages have broken asset paths since a 2025 reorganisation and are left as they are.
- `Kuvat/`: images used by those legacy pages.
- `Päiväkirjatyö/` and `MVC-harjoitus/`: two PHP and MySQL school projects, source only. GitHub Pages does not run PHP, so they cannot run here. See their own READMEs.
- `Projekti.pdf`: an old file that I have not touched.

## Run it locally

```
python3 -m http.server 8000
```

Then open http://127.0.0.1:8000/. Any static file server works.

## The slideshow

The site is one full-height page with eight slides, in this order: 1 `/hello`, 2 `/path`, 3 `/skills`, 4 `/trinketbot`, 5 `/architecture`, 6 `/numbers`, 7 `/how-i-work`, 8 `/learning-curve`. Choosing a command in the top bar, pressing Left, Right or 1 to 8, or following a link that runs a command plays one transition: the command is typed into the console, a short boot log prints with a progress bar, and the new slide is written into the layout. The address bar gets the slide id as the hash (`/#trinketbot`), so Back, Forward and deep links work. The mouse wheel and touch swipe never change slides. A key press, click or tap during a transition finishes it at once.

Three kinds of run, each with its own pace:

- **The opening** (about 7 s). It plays when the page lands on `/hello`: a plain load, or a load with `#hello`. The console starts at once and prints a short boot log (`start portfolio`, `load fonts`, ...) with a progress bar, then the command `/hello` is typed and sent, the name is written letter by letter with a cursor, the role line is typed, the status panel prints line by line like terminal output, and the two buttons arrive last. Landing on any other hash, such as `/#skills`, does not play it; that slide plays its first-visit transition. Going back to `/hello` later plays the revisit transition.
- **A first visit** of any other slide (about 5 s): the full run described above.
- **A revisit** (about 2 s): a short run with two log lines.

### Speed

All the timing is in one table at the top of `assets/js/main.js`: `PACE` (seconds, with a comment for every field) and `SPEED`, a single factor for everything (1.25 is a quarter faster, 0.8 a quarter slower). `fx` in each row scales every reveal in the `FX` object, whose own values are the base. A run sets `data-state="running"` on `<html>` and back to `idle` when it ends, so it is easy to time. The failsafe (`FAILSAFE`, 11 s, or 1.6 times the run, whichever is longer) finishes a run that has stalled.

### Animations on and off

The footer has a switch, `animations: on` or `off` (a button with `role="switch"`). Off means: slides swap at once (the prompt line still updates), the `/hello` hero is complete on load, there is no typing and no log animation, and the idle loops (the pulse on the availability dot, the blinking cursors) stop. Turning it off while something runs finishes it at once; turning it on takes effect from the next transition. The choice is kept in `localStorage` under the key `anim`; if storage is blocked it is simply not kept. With `prefers-reduced-motion: reduce` the animations are off by default, the switch shows `off` and a note that it follows the system setting (the note is added to the page only while that setting is on), and it cannot be turned on against that setting. If GSAP is missing (blocked or failed to load) there is nothing to switch, so the switch is hidden (its space stays reserved, so the footer does not move) and the page runs as animations off.

The page is complete without any of that. With JavaScript off, with animations off, with `prefers-reduced-motion: reduce`, or if GSAP fails to load, the slides swap instantly or sit stacked as normal sections, and all text is in the HTML. Without JavaScript the top bar and the footer are normal in-flow elements (the bar is not sticky), so the document reads from top to bottom. The page is always in one mode: if `main.js` has not arrived after 3.5 s (a very slow connection) the inline failsafe in `<head>` leaves the stacked document and `main.js` keeps to that when it does arrive, and if GSAP throws while a run is being built the slide is shown finished (every start state cleared, one `console.warn`). The typed command, the log, the progress bar and the writing cursor are decorative (`aria-hidden`); the real text is never rewritten.

## The home slide

`/hello` is the name, set large in a serif, with the role line and the two buttons beside a terminal status panel. The panel is the `.who` block in `index.html`: a decorative prompt line (`$ whoami`, `aria-hidden`), then a real `<dl>` with one `.who-row` per line (`dt` is the key, `dd` the value) and a decorative empty prompt with a cursor. To change a line, edit its `dt` and `dd`; to add one, copy a `.who-row`. The rows are plain text in the page, always complete with JavaScript off, with reduced motion and with the animation switch off. The `print` effect (`FX.print` in `main.js`) only reveals them with a clip, in character steps, and never rewrites the text. The opening prints the panel after the role line and the buttons arrive last (`PACE.opening.at`). On phones the panel sits below the buttons; on short phones (under 820 px high) the spacing is tighter and the name takes the height that is left (`52cqh` of the slide, in `site.css`), so the whole slide fits one screen at 360x740, 375x667 and larger, with or without the reduced-motion note in the footer. At 320x640 and on landscape phones the slide scrolls inside itself.

## The mark and where the Trinket appears

The mark is a slash and an underscore cursor (`/_`) in ice blue on deep navy, plain SVG shapes with no font. It is inlined in the top bar (`.mark-ico`), in `404.html` and in the `Harjoitus7.html` redirect stub, and it is the favicon (`assets/img/favicon.svg`, plus `favicon-32.png` and the 180 px `apple-touch-icon.png`, drawn from the same shapes) and the base of the share image `assets/img/og.jpg` (1200x630: name, role, location and the mark).

The Trinket logo is used on the TrinketBot slides only, wherever TrinketBot appears: as the bot avatar in the `/trinketbot` alert illustration and in the `/learning-curve` entry for 2026, both from the small file `assets/img/trinket-96.webp`, which is lazy: a plain load of `/hello` does not request it, and `main.js` fetches it in idle time a few seconds after the first run has settled, so it is cached before its slide is written in (the stacked no-JS page loads it as the visitor scrolls). It is not on `/hello`, in the top bar, in the icons, the share image or the 404 page. The credit for it ("Trinket, mascot art by MallieSprout") is on the `/trinketbot` slide, in the About panel and in `licenses.txt`.

## The learning-curve slide

`/learning-curve` shows nine entries in two rows, oldest first. Each row is its own ordered list (`ol.curve`, named by its row label through `aria-labelledby`) with its own rail and diamonds, inside a `.lc-row` that also holds the row label (years only: `2020 to 2022`, `2025 to 2026`).

- Row one, five school entries with links: Kellot soi, vai soiko? (2020), Päiväkirja (2021), Lantapahtuma / TreduLan (2021), Fanikauppa (2022), Card Game Adventure (2022). These are unchanged.
- Row two, four entries: Linux and C/C++ exercises (2025), TAMK web and API courses (2026, one combined entry), Jira app for a customer (2026), and TrinketBot (2026), the lit end of the curve, which links to the `/trinketbot` slide.
- The three new entries have **no link and no screenshot**. Each says why in the small monospace line under its text: `No public link` (the Linux exercises are a local folder), `Private repositories` (the two course projects) or `Private repository` (the Jira app, which was built with a collaborator for a customer; the customer is not named). Their captions were checked against the files they describe, and the page states no test count.
- Their tiles are drawn in CSS like the TreduLan tile (`aria-hidden`, no real code or names): `.tile-sys` (thread lanes forking from a spine), `.tile-stack` (three layers: web, api, db) and `.tile-weeks` (bars on a weekly grid).
- On a desktop window the rows are two rails with the year written on the rail beside its diamond. Row one has five columns weighted by how much text each entry has, row two four equal columns, all tiles are strips of one height, and the lede moves up beside the title, so both rows fit one screen at 1440x900 and 1280x720 without scrolling. On tablets row one has three columns and row two four. On phones each row is a vertical rail and the slide scrolls inside itself.
- The log lines for this slide (`SCRIPT['learning-curve']` in `main.js`) are `run /learning-curve`, `load row {i}/2`, `write entry {i}/9`, `load thumbnail {i}/9` and `ready`. The two rows are revealed first, then the entries and the thumbnails run through row one and on through row two in document order. The year of an entry (`data-fx="rail"`) carries its diamond and the rail to the next one, so they are written in with it.
- To add an entry, copy a `li.ent` into the right row, keep `data-group`, and change the counts in the `SCRIPT` line (`{i}/9`) and the `count`. Row one is sized for five entries and row two for four: check the fit at 1280x720 after adding a fifth to a row.

The `/skills` slide also names the 2026 course projects: the group "Backed by TrinketBot and the 2026 course projects" holds Prisma and CI/CD with GitHub Actions and GitLab CI next to the TrinketBot tags, and C++ and Java are in "Also worked with", marked "course level" in the tag text.

## Changing content

Edit `index.html` directly for text and links, `assets/css/site.css` for the look, and `assets/js/main.js` for behaviour. Update the "Last updated" line in the About panel when content changes.

Each part of a slide that is written in during the transition carries two attributes: `data-step` (which boot log line reveals it) and `data-fx` (how it is revealed: `cmd`, `type`, `lines`, `wipe`, `rail`, `name`, `box`, `up`, `pop-each`, `fill`, `print`, `dg`, `panel`, `alert`). The log lines of each slide are the `SCRIPT` object in `assets/js/main.js` (a line can reveal several steps: `'name role'`), the opening has its own list, `OPENING`, and its own times in `PACE.opening.at`, and the effects are the `FX` object. Log lines must name real parts of the slide and must not claim network activity, sizes or timings.

### How to add a slide

1. In `index.html`, add a `<section class="slide" id="my-slide" data-cmd="/my-slide" aria-labelledby="h-my-slide">` inside `<main>`, with `<div class="slide-in"><h2 class="cmd" id="h-my-slide" tabindex="-1" data-step="title" data-fx="cmd">/my-slide</h2><div class="slide-body">...</div></div>`. Put `data-step` and `data-fx` on the parts that should be written in.
2. Add a link to the nav list: `<li><a href="#my-slide" data-go="my-slide"><span class="cn">/my-slide</span><span class="cd">Short description</span></a></li>`.
3. In `assets/js/main.js`, add the id to `IDS` (the order is the nav order and the key numbers) and add a `SCRIPT` entry (last line `ready`, and its `{i}/n` counter lines need a `count`). Put the `<section>` at the same place in `index.html` as in `IDS`, because the stacked no-JS and print layout follows the document order. Do the same for the id list in the inline script in the `<head>` of `index.html`, and update the visible "/8" counter, the "1 to 8" key hint and the console placeholder in the markup.
4. A slide must fit one screen at 1440x900 and 1280x720; on phones it scrolls inside itself. Check it with the QA tools, if you have them, or by eye.

## The PHP projects

`Päiväkirjatyö/` and `MVC-harjoitus/` need PHP and a MySQL or MariaDB database, and there is no schema file in the repository. Each has a `database/config.sample.php`: copy it to `database/config.php` and fill in your own values. `config.php` is git-ignored. The original school database server no longer exists.

An earlier version of these two projects had database credentials written into the source. They have been removed from the current files, but they are still in the git history of this repository.

## Libraries and licences

- GSAP 3.15.0, used under the GreenSock "Standard No Charge" licence (the licence header stays in `assets/vendor/gsap.min.js`).
- Typefaces, all SIL Open Font License 1.1, with their licence texts in `assets/fonts/`: Instrument Serif (upright only), Figtree and JetBrains Mono (variable).
- Trinket, the TrinketBot logo, art by MallieSprout (https://twitch.tv/malliesprout), used on this portfolio with the TrinketBot owner's approval. It is not licensed for reuse. It is shown only where TrinketBot appears, and this one picture is the only mascot art on the site.

Full texts and versions are in `licenses.txt`.

## TrinketBot

The portfolio describes TrinketBot, a Discord bot and web dashboard that I build. Its source repository is private. A code walkthrough is available on request.

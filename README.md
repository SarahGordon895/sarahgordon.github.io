# Sarah Gordon — portfolio (static site)

This repository is a **static** HTML/CSS/JavaScript portfolio. There is no build step and no server-side code required.

**Live site (GitHub Pages):** [https://sarahgordon895.github.io/sarahgordon.github.io/](https://sarahgordon895.github.io/sarahgordon.github.io/)

### Portfolio thumbnails

Featured project previews live in `images/projects/` (one file per card, e.g. `school-receipt.jpg`). Replace any file with a real screenshot of that app — keep the same filename so `index.html` does not need to change.

## Run locally with XAMPP (matches your setup)

1. Start **Apache** from the XAMPP Control Panel.
2. Open a browser and go to:

   `http://localhost/personal%20projects/sarahgordon.github.io/`

   If you moved the folder, use the path under `htdocs` with each segment URL-encoded (spaces become `%20`).

3. Ensure **fonts and icons load**: the page uses Google Fonts and Font Awesome from CDNs, so the machine needs internet access for those requests.

## Run without XAMPP (optional)

From this folder, any static file server works, for example:

`npx --yes serve -l 3000`

Then open the URL printed in the terminal (often `http://localhost:3000`).

## Contact form

Submitting the form opens the default mail client with a **mailto:** draft to the address configured in `index.html` / `js/script.js`. There is no backend mail API in this project.

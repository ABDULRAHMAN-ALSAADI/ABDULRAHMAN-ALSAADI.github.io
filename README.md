# Abdulrahman Alsaadi | Portfolio

Static site. No build step, no backend.

## Deploy on GitHub Pages
1. Create a repository (for example `abdulrahman-alsaadi.github.io`).
2. Upload **everything inside this `portfolio` folder** (not the folder itself).
3. Settings > Pages > Deploy from branch > `main` / root.

## Edit content
All text, projects, stats and skills live in `content.json`. Images go in `images/projects/`.
Use the private admin page to edit them comfortably, then replace `content.json` in the repo.

## Security notes
- Visitors can only read the site. Nobody can change it without your GitHub login, so turn on two-factor authentication for GitHub.
- `admin.html` is encrypted. It only opens with your password.
- Never upload the separate `admin-private` folder.

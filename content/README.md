# Editing the CanWise Law website

The editable website content lives in this folder. On GitHub, open a file and click the pencil icon to edit it.

## Main pages

- `pages/home.html` — Home
- `pages/about.html` — About
- `pages/practice-areas.html` — Practice Areas
- `pages/contact.html` — Contact

Each `<section>...</section>` is one module. Edit text inside a section or move the complete section block to rearrange modules.

## Blog

Each file in `blog` is one complete article. Keep the information between the two `---` lines, then edit the article below it.

## Detailed pages

Files in `embedded` contain the preserved Hostinger-designed service and fee pages. They remain editable HTML, but have more detailed layouts.

## Publishing

Edits committed to `content` on the `main` branch trigger an automatic rebuild. GitHub Pages then publishes the result; allow a few minutes.

Use GitHub's Preview tab before committing and avoid deleting HTML tags unless you intend to remove an element.

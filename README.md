# CanWise Law website

Editable page modules and blog articles are in [`content`](content/README.md). Changes committed there on `main` are automatically rebuilt for GitHub Pages.

Static website for CanWise Law, prepared for GitHub Pages.

GitHub account rule: all repository work must be performed through the verified account `cherry88cn`.

## Project documentation

- [Website working manual](docs/WEBSITE_WORKING_MANUAL.md)
- [Change log](docs/CHANGELOG.md)
- [Decision record](docs/DECISIONS.md)
- [Recovery and new-computer guide](docs/RECOVERY.md)
- [External integrations](docs/INTEGRATIONS.md)
- [Production URL and source map](docs/CONTENT_MAP.md)
- [Legacy redirect register](docs/REDIRECTS.md)
- [Website asset register](docs/ASSET_REGISTER.md)
- [SEO checklist](docs/SEO_CHECKLIST.md)
- [Release checklist](docs/RELEASE_CHECKLIST.md)
- [Chinese translation rules](TRANSLATION_RULES.md)
- [Editable content guide](content/README.md)

GitHub is the authoritative copy of the website source, permanent rules, major decisions, and material change history. Local clones are working copies only.

## Local build

Use Node.js 22 and run these commands from the repository root:

```text
node scripts/build-site.mjs
node scripts/build-site.test.mjs
node scripts/check-site.mjs
```

The build uses only files stored in this repository, except for clearly documented external services linked or embedded by the generated site.

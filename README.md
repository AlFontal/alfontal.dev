# alfontal.dev <img src="web/public/assets/media/logo_alejandro.png" align="right" width="120" />
[![Netlify Status](https://api.netlify.com/api/v1/badges/ed83a5a9-9ce4-43dc-85b0-6c8779cc67a6/deploy-status)](https://app.netlify.com/sites/alfontal/deploys)


This is the repository with the source code for my personal website [alfontal.dev](https://alfontal.dev), now built with Astro in the `web/` app.

The active web app lives in `web/` and is deployed from `web/dist`.

Notebook-based blog posts are sourced from `notebooks/` and transformed into Astro content by `web/scripts/render-notebooks.mjs`.
Quarto is used there only as an intermediate notebook-to-Markdown renderer.

The `main` branch contains the source, while the `site-html` branch contains the built static output published by GitHub Actions.

# Web (Astro Site)

This folder contains a modern static-first reimplementation of `alfontal.dev` using [Astro](https://astro.build/), focused on:

- fast static output
- semantic and accessible HTML
- minimal client-side JavaScript
- a scientific + code-forward visual identity

## Implemented routes

- `/` About / profile landing
- `/blog` Blog listing
- `/blog/first-post` First post article page
- `/projects` Project cards
- `/publications` Publication list with DOI/PDF/code links

## Local development

```bash
cd web
npm install
npm run dev
```

## Notebook to Blog Post

Notebook posts are sourced from `notebooks/<section>/<name>.ipynb`.

Expected notebook structure:

- the first cell must be Markdown containing YAML front matter
- required fields are `title`, `description`, `date`, `categories`, `author`, and `image`
- companion assets can live next to the notebook and will be copied into `public/assets/notebooks/...`

Publishing flow:

1. Create or update the notebook in `notebooks/`.
2. Set the front matter and preview image path in the notebook.
3. Regenerate notebook-derived content.
4. Preview the result locally in Astro.

Quarto is used here only as an intermediate notebook-to-Markdown converter:

```bash
npm run notebooks:render
```

For non-notebook articles, add Astro pages directly under `web/src/pages/blog/`.

Build production files:

```bash
npm run build
```

The production site is generated into `web/dist`.

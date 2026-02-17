# Framework (Astro Site)

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
cd framework
npm install
npm run dev
```

Regenerate notebook-derived content manually:

```bash
npm run notebooks:render
```

Build production files:

```bash
npm run build
```

The production site is generated into `framework/dist`.

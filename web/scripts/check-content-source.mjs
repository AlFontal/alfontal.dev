import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const targets = [
  'src/layouts/BaseLayout.astro',
  'src/pages/index.astro',
  'src/pages/cv.astro',
  'src/pages/projects.astro',
  'src/pages/publications.astro',
  'src/pages/blog/index.astro',
];

const importPattern = /from\s+['"](\.\.\/)+data\/cv['"]/;

const run = async () => {
  const offenders = [];

  for (const target of targets) {
    const file = resolve(root, target);
    const source = await readFile(file, 'utf8');

    if (importPattern.test(source)) {
      offenders.push(target);
    }
  }

  if (offenders.length > 0) {
    throw new Error(`Expected a single content source. Remove ../data/cv imports from: ${offenders.join(', ')}`);
  }

  console.log(`Verified content imports for ${targets.length} Astro files.`);
};

await run();

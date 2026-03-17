#!/usr/bin/env node

import { execFile } from 'node:child_process';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import YAML from 'yaml';

const execFileAsync = promisify(execFile);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frameworkRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(frameworkRoot, '..');

const sourcePostsRoot = path.join(repoRoot, 'notebooks');
const generatedContentRoot = path.join(frameworkRoot, 'src', 'content', 'notebooks-generated');
const generatedManifestPath = path.join(frameworkRoot, 'src', 'generated', 'notebooks-manifest.json');
const generatedPublicAssetsRoot = path.join(frameworkRoot, 'public', 'assets', 'notebooks');

const REQUIRED_FIELDS = ['title', 'description', 'date', 'categories', 'author', 'image'];

function fail(message) {
  console.error(`\n[notebooks:render] ${message}`);
  process.exit(1);
}

function isRelativeUrl(value) {
  return !(
    value.startsWith('/') ||
    value.startsWith('#') ||
    value.startsWith('data:') ||
    value.startsWith('mailto:') ||
    value.startsWith('tel:') ||
    /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(value)
  );
}

function rewriteUrl(rawUrl, basePath) {
  if (!rawUrl || !isRelativeUrl(rawUrl)) {
    return rawUrl;
  }

  const normalizedInput = rawUrl.replace(/\\/g, '/').replace(/^\.\//, '');
  const matchIndex = normalizedInput.search(/[?#]/);
  const filePath = matchIndex >= 0 ? normalizedInput.slice(0, matchIndex) : normalizedInput;
  const suffix = matchIndex >= 0 ? normalizedInput.slice(matchIndex) : '';

  const joined = path.posix.normalize(path.posix.join(basePath, filePath));
  if (!joined.startsWith(basePath)) {
    throw new Error(`Relative path escaped asset root: ${rawUrl}`);
  }

  return `${joined}${suffix}`;
}

function rewriteRelativeReferences(markdown, assetBasePath) {
  let transformed = markdown;

  transformed = transformed.replace(/(!?\[[^\]]*\]\()([^\)]+)(\))/g, (_match, start, target, end) => {
    const trimmed = target.trim();
    const parsed = trimmed.match(/^(\S+)(\s+.*)?$/);
    if (!parsed) {
      return _match;
    }

    const rewritten = rewriteUrl(parsed[1], assetBasePath);
    return `${start}${rewritten}${parsed[2] ?? ''}${end}`;
  });

  transformed = transformed.replace(/(<(?:img|a)\b[^>]*?\b(?:src|href)=")([^"]+)("[^>]*>)/g, (_match, start, target, end) => {
    const rewritten = rewriteUrl(target, assetBasePath);
    return `${start}${rewritten}${end}`;
  });

  transformed = transformed.replace(/(<(?:img|a)\b[^>]*?\b(?:src|href)=')([^']+)('[^>]*>)/g, (_match, start, target, end) => {
    const rewritten = rewriteUrl(target, assetBasePath);
    return `${start}${rewritten}${end}`;
  });

  return transformed;
}

function stripQuartoPrelude(markdown, metadata) {
  const lines = markdown.split('\n');
  const expectedTitle = `# ${metadata.title}`;

  if (lines[0]?.trim() !== expectedTitle) {
    return markdown;
  }

  let cursor = 1;

  while (cursor < lines.length && lines[cursor].trim() === '') {
    cursor += 1;
  }

  if (lines[cursor]?.trim() === String(metadata.author).trim()) {
    cursor += 1;
  }

  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (datePattern.test(lines[cursor]?.trim() ?? '')) {
    cursor += 1;
  }

  while (cursor < lines.length && lines[cursor].trim() === '') {
    cursor += 1;
  }

  return lines.slice(cursor).join('\n');
}

function extractFrontMatterFromNotebook(notebookJson, sourcePath) {
  const firstCell = notebookJson.cells?.[0];
  if (!firstCell || firstCell.cell_type !== 'markdown') {
    throw new Error(`First cell must be markdown with YAML front matter in ${sourcePath}`);
  }

  const source = Array.isArray(firstCell.source) ? firstCell.source.join('') : String(firstCell.source ?? '');
  const match = source.match(/^---\n([\s\S]*?)\n---\s*$/m);

  if (!match) {
    throw new Error(`Missing YAML front matter in first markdown cell for ${sourcePath}`);
  }

  const parsed = YAML.parse(match[1]);
  if (!parsed || typeof parsed !== 'object') {
    throw new Error(`Invalid YAML front matter in ${sourcePath}`);
  }

  for (const field of REQUIRED_FIELDS) {
    if (!(field in parsed)) {
      throw new Error(`Missing required metadata field '${field}' in ${sourcePath}`);
    }
  }

  if (!Array.isArray(parsed.categories)) {
    throw new Error(`Metadata field 'categories' must be an array in ${sourcePath}`);
  }

  return parsed;
}

async function exists(pathLike) {
  try {
    await fs.access(pathLike);
    return true;
  } catch {
    return false;
  }
}

async function copyRecursive(source, destination) {
  const stats = await fs.stat(source);

  if (stats.isDirectory()) {
    await fs.mkdir(destination, { recursive: true });
    const entries = await fs.readdir(source, { withFileTypes: true });
    entries.sort((a, b) => a.name.localeCompare(b.name));

    for (const entry of entries) {
      if (entry.name.startsWith('.')) {
        continue;
      }
      await copyRecursive(path.join(source, entry.name), path.join(destination, entry.name));
    }
    return;
  }

  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.copyFile(source, destination);
}

async function listNotebookSources() {
  const sections = await fs.readdir(sourcePostsRoot, { withFileTypes: true });
  const notebooks = [];

  for (const sectionEntry of sections.sort((a, b) => a.name.localeCompare(b.name))) {
    if (!sectionEntry.isDirectory() || sectionEntry.name.startsWith('.')) {
      continue;
    }

    const sectionDir = path.join(sourcePostsRoot, sectionEntry.name);
    const entries = await fs.readdir(sectionDir, { withFileTypes: true });

    for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
      if (!entry.isFile() || !entry.name.endsWith('.ipynb')) {
        continue;
      }

      notebooks.push({
        section: sectionEntry.name,
        notebook: path.basename(entry.name, '.ipynb'),
        sourcePath: path.join(sectionDir, entry.name),
        sourceDir: sectionDir,
      });
    }
  }

  return notebooks;
}

async function renderNotebookToMarkdown(notebookPath, notebookName) {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'astro-notebook-'));
  const tempNotebookPath = path.join(tmpDir, `${notebookName}.ipynb`);
  const outputName = `${notebookName}.md`;

  await fs.copyFile(notebookPath, tempNotebookPath);

  try {
    await execFileAsync(
      'quarto',
      ['render', `${notebookName}.ipynb`, '--to', 'gfm', '--no-execute', '--output', outputName],
      {
        cwd: tmpDir,
        maxBuffer: 10 * 1024 * 1024,
      },
    );
  } catch (error) {
    const stderr = error?.stderr ? String(error.stderr) : 'Unknown Quarto error';
    throw new Error(`Quarto failed for ${notebookPath}: ${stderr}`);
  }

  const markdown = await fs.readFile(path.join(tmpDir, outputName), 'utf8');
  return { markdown, tmpDir };
}

async function copyNotebookAssets(context, tmpRenderDir) {
  const { sourceDir, section, notebook } = context;
  const destinationRoot = path.join(generatedPublicAssetsRoot, section, notebook);

  await fs.mkdir(destinationRoot, { recursive: true });

  const siblingEntries = await fs.readdir(sourceDir, { withFileTypes: true });
  siblingEntries.sort((a, b) => a.name.localeCompare(b.name));

  for (const entry of siblingEntries) {
    if (entry.name.startsWith('.')) {
      continue;
    }
    if (entry.name === `${notebook}.ipynb`) {
      continue;
    }

    await copyRecursive(path.join(sourceDir, entry.name), path.join(destinationRoot, entry.name));
  }

  const quartoAssetsDir = path.join(tmpRenderDir, `${notebook}_files`);
  if (await exists(quartoAssetsDir)) {
    await copyRecursive(quartoAssetsDir, path.join(destinationRoot, `${notebook}_files`));
  }
}

function buildGeneratedFrontMatter(metadata, context) {
  const { section, notebook } = context;
  const assetBasePath = `/assets/notebooks/${section}/${notebook}`;
  const imageValue = isRelativeUrl(String(metadata.image))
    ? rewriteUrl(String(metadata.image), assetBasePath)
    : String(metadata.image);

  return {
    title: String(metadata.title),
    description: String(metadata.description),
    date: String(metadata.date),
    categories: metadata.categories.map((value) => String(value)),
    author: String(metadata.author),
    image: imageValue,
    section,
    notebook,
    routePath: `/posts/${section}/${notebook}`,
  };
}

async function cleanGeneratedOutputs() {
  await fs.rm(generatedContentRoot, { recursive: true, force: true });
  await fs.rm(generatedPublicAssetsRoot, { recursive: true, force: true });
  await fs.rm(generatedManifestPath, { force: true });

  await fs.mkdir(generatedContentRoot, { recursive: true });
  await fs.mkdir(generatedPublicAssetsRoot, { recursive: true });
  await fs.mkdir(path.dirname(generatedManifestPath), { recursive: true });
}

async function main() {
  const notebooks = await listNotebookSources();
  if (!notebooks.length) {
    fail(`No notebooks found under ${sourcePostsRoot}`);
  }

  await cleanGeneratedOutputs();

  const seenRoutePaths = new Set();
  const manifest = [];

  for (const notebookContext of notebooks) {
    const rawNotebook = JSON.parse(await fs.readFile(notebookContext.sourcePath, 'utf8'));
    const metadata = extractFrontMatterFromNotebook(rawNotebook, notebookContext.sourcePath);
    const generatedFrontMatter = buildGeneratedFrontMatter(metadata, notebookContext);

    if (seenRoutePaths.has(generatedFrontMatter.routePath)) {
      throw new Error(`Duplicate notebook route path detected: ${generatedFrontMatter.routePath}`);
    }
    seenRoutePaths.add(generatedFrontMatter.routePath);

    const { markdown, tmpDir } = await renderNotebookToMarkdown(
      notebookContext.sourcePath,
      notebookContext.notebook,
    );

    await copyNotebookAssets(notebookContext, tmpDir);

    const assetBasePath = `/assets/notebooks/${notebookContext.section}/${notebookContext.notebook}`;
    const strippedMarkdown = stripQuartoPrelude(markdown, generatedFrontMatter);
    const rewrittenMarkdown = rewriteRelativeReferences(strippedMarkdown, assetBasePath);

    const frontMatterYaml = YAML.stringify(generatedFrontMatter).trimEnd();
    const finalMarkdown = `---\n${frontMatterYaml}\n---\n\n${rewrittenMarkdown.trimStart()}\n`;

    const targetFile = path.join(
      generatedContentRoot,
      notebookContext.section,
      `${notebookContext.notebook}.md`,
    );
    await fs.mkdir(path.dirname(targetFile), { recursive: true });
    await fs.writeFile(targetFile, finalMarkdown, 'utf8');

    manifest.push({
      section: notebookContext.section,
      notebook: notebookContext.notebook,
      sourcePath: path.relative(repoRoot, notebookContext.sourcePath).replace(/\\/g, '/'),
      contentPath: path.relative(frameworkRoot, targetFile).replace(/\\/g, '/'),
      routePath: generatedFrontMatter.routePath,
      image: generatedFrontMatter.image,
      date: generatedFrontMatter.date,
      categories: generatedFrontMatter.categories,
    });
  }

  manifest.sort((a, b) => a.routePath.localeCompare(b.routePath));
  await fs.writeFile(generatedManifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  console.log(`[notebooks:render] Rendered ${manifest.length} notebook(s).`);
}

main().catch((error) => {
  fail(error instanceof Error ? error.message : String(error));
});

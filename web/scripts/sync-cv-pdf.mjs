// Renders the baseline CV in the sister career-coach repo (Quarto + Typst) and copies
// the PDF into public/. Local-only: CI has no access to career-coach, so the copied PDF
// is committed here. Set CAREER_COACH_DIR if the repo is not at ~/projects/career-coach.
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const webDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const careerCoachDir = path.resolve(process.env.CAREER_COACH_DIR ?? path.join(homedir(), 'projects', 'career-coach'));
const renderScript = path.join(careerCoachDir, 'scripts', 'render_cv.sh');
const source = path.join(careerCoachDir, 'cv', 'alejandro-fontal-cv.pdf');
const target = path.join(webDir, 'public', 'assets', 'cv', 'Alejandro_Fontal_CV.pdf');

if (!existsSync(renderScript)) {
  console.error(`career-coach not found at ${careerCoachDir}. Set CAREER_COACH_DIR to its path.`);
  process.exit(1);
}

execFileSync(renderScript, { cwd: careerCoachDir, stdio: 'inherit' });
copyFileSync(source, target);
console.log(`Copied ${path.relative(process.cwd(), source) || source} -> ${path.relative(process.cwd(), target)}`);

// @ts-check
import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'astro/config';

const notebookPublicRoot = path.resolve('public', 'posts');

function notebookDevRouteRewrite() {
	return {
		name: 'notebook-dev-route-rewrite',
		configureServer(server) {
			server.middlewares.use((req, _res, next) => {
				const rawUrl = req.url;

				if (!rawUrl) {
					next();
					return;
				}

				const [pathname, search = ''] = rawUrl.split('?');
				const normalizedPath = pathname.replace(/\/$/, '');

				if (!normalizedPath.startsWith('/posts/') || normalizedPath.endsWith('.html')) {
					next();
					return;
				}

				const candidateFile = path.join(notebookPublicRoot, normalizedPath.slice('/posts/'.length), 'index.html');

				if (fs.existsSync(candidateFile)) {
					req.url = `${normalizedPath}/index.html${search ? `?${search}` : ''}`;
				}

				next();
			});
		},
	};
}

// https://astro.build/config
export default defineConfig({
	// Keep old URLs working: Publications was renamed to Research, and posts moved from
	// /posts/<folder>/<notebook>/ to /posts/<folder>/.
	redirects: {
		'/publications': '/research/',
		'/posts/ggsql-jp-idwr-db/ggsql_jp_idwr_db': '/posts/ggsql-jp-idwr-db/',
		'/posts/kd-tokyo-air-sources/kd_tokyo_air_sources': '/posts/kd-tokyo-air-sources/',
		'/posts/vegetation-land-use/land_use': '/posts/vegetation-land-use/',
		'/posts/world-population/world_pop_densities': '/posts/world-population/',
	},
	// Astro 7 defaults to 'jsx', which drops whitespace between inline elements.
	compressHTML: true,
	vite: {
		plugins: [notebookDevRouteRewrite()],
	},
});

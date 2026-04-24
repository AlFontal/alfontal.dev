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
	vite: {
		plugins: [notebookDevRouteRewrite()],
	},
});

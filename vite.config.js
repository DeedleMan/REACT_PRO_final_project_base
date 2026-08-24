import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import fs from 'fs';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

const srcPath = path.resolve(__dirname, 'src');

// Плагин для обработки SVG как React компонентов
function svgPlugin() {
	return {
		name: 'vite-plugin-svg-react',
		enforce: 'pre',
		load(id) {
			// Обрабатываем только SVG из папки icons
			if (!id.includes('/icons/') && !id.includes('\\icons\\')) {
				return null;
			}
			if (!id.endsWith('.svg')) return null;

			const svgContent = fs.readFileSync(id, 'utf8');
			const componentName = path.basename(id, '.svg');
			const safeContent = svgContent
				.replace(/'/g, "\\'")
				.replace(/\n/g, ' ')
				.replace(/\r/g, '');

			return `
				import React from 'react';
				function ${componentName}(props) {
					return React.createElement('svg', {
						xmlns: "http://www.w3.org/2000/svg",
						...props,
						dangerouslySetInnerHTML: { __html: '${safeContent}' }
					});
				}
				export const ReactComponent = ${componentName};
				export default ${componentName};
			`;
		},
	};
}

export default defineConfig({
	plugins: [react(), svgPlugin()],
	root: '.',
	publicDir: 'public',

	base: '/',

	build: {
		outDir: 'dist',
		emptyOutDir: true,
		rollupOptions: {
			input: path.resolve(srcPath, 'index.tsx'),
			output: {
				dir: 'dist',
				entryFileNames: 'static/scripts/[name].[hash].js',
				chunkFileNames: 'static/scripts/[name].[hash].js',
				assetFileNames: (assetInfo) => {
					if (assetInfo.name && assetInfo.name.endsWith('.css')) {
						return 'static/styles/[name]-[hash][extname]';
					}
					return 'static/assets/[name]-[hash][extname]';
				},
			},
		},
		minify: 'esbuild',
		cssCodeSplit: true,
		sourcemap: false,
	},

	resolve: {
		alias: {
			'@app': path.resolve(srcPath, 'app'),
			'@pages': path.resolve(srcPath, 'pages'),
			'@widgets': path.resolve(srcPath, 'widgets'),
			'@features': path.resolve(srcPath, 'features'),
			'@entities': path.resolve(srcPath, 'entities'),
			'@shared': path.resolve(srcPath, 'shared'),
		},
	},

	css: {
		postcss: {
			plugins: [autoprefixer, cssnano({ preset: 'default' })],
		},
	},

	define: {
		'process.env': JSON.stringify({
			NODE_ENV: 'production',
			...process.env,
		}),
	},
});

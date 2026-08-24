const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const ROOT_PATH = path.resolve(__dirname);
const srcPath = path.resolve(ROOT_PATH, 'src');
const distPath = path.resolve(ROOT_PATH, 'dist');
const production = process.env.NODE_ENV === 'production';

// --- Алиасы FSD ---
const aliases = {
	app: path.resolve(srcPath, 'app'),
	pages: path.resolve(srcPath, 'pages'),
	widgets: path.resolve(srcPath, 'widgets'),
	features: path.resolve(srcPath, 'features'),
	entities: path.resolve(srcPath, 'entities'),
	shared: path.resolve(srcPath, 'shared'),
};

// --- Плагин для алиасов ---
function aliasPlugin() {
	return {
		name: 'alias',
		setup(build) {
			build.onResolve(
				{ filter: /^@app|@pages|@widgets|@features|@entities|@shared/ },
				(args) => {
					const aliasKey = Object.keys(aliases).find(
						(key) => args.path === `@${key}` || args.path.startsWith(`@${key}/`)
					);

					if (aliasKey) {
						// Получаем путь после @key/ ( @ = 1, key.length, / = 1)
						const prefix = `@${aliasKey}/`;
						const suffix = args.path.startsWith(prefix)
							? args.path.substring(prefix.length)
							: ''; // Точное совпадение @key

						// Сначала пробуем .tsx/.ts файлы
						const tryPaths = [
							path.resolve(aliases[aliasKey], `${suffix}.tsx`),
							path.resolve(aliases[aliasKey], `${suffix}.ts`),
							path.resolve(aliases[aliasKey], `${suffix}.jsx`),
							path.resolve(aliases[aliasKey], `${suffix}.js`),
						];

						for (const tryPath of tryPaths) {
							if (fs.existsSync(tryPath)) {
								return { path: tryPath, external: false };
							}
						}

						// Пробуем как директорию с index
						const indexPaths = [
							path.resolve(aliases[aliasKey], suffix, 'index.tsx'),
							path.resolve(aliases[aliasKey], suffix, 'index.ts'),
						];

						for (const indexPath of indexPaths) {
							if (fs.existsSync(indexPath)) {
								return { path: indexPath, external: false };
							}
						}

						// Fallback — абсолютный путь для понятной ошибки
						const fallback = path.resolve(aliases[aliasKey], suffix);
						return { path: fallback, external: false };
					}
				}
			);
		},
	};
}

// --- Плагин для CSS Modules ---
function cssModulesPlugin() {
	return {
		name: 'css-modules',
		setup(build) {
			build.onLoad({ filter: /\.module\.css$/ }, async (args) => {
				// Простая обработка CSS Modules — просто отдаём файл как есть
				// Для продакшена нужен полноценный парсер CSS Modules
				const content = fs.readFileSync(args.path, 'utf8');
				return { contents: content, loader: 'text' };
			});
		},
	};
}

// --- Плагин для SVG (импорт как React компонент) ---
function svgPlugin() {
	return {
		name: 'svg',
		setup(build) {
			build.onLoad({ filter: /\.svg$/ }, async (args) => {
				const svgContent = fs.readFileSync(args.path, 'utf8');
				const componentName = path.basename(args.path, '.svg');
				// Экранируем одинарные кавыки и переносы строк
				const safeContent = svgContent
					.replace(/'/g, "\\'")
					.replace(/\n/g, ' ')
					.replace(/\r/g, '');

				// Поддерживаем два формата импорта:
				// 1. import { ReactComponent as X } from './icon.svg'
				// 2. import X from './icon.svg'
				const reactComponent = `
					import React from 'react';
					
					const ${componentName} = (props) => (
						<svg xmlns="http://www.w3.org/2000/svg" {...props} dangerouslySetInnerHTML={{ __html: '${safeContent}' }} />
					);
					
					export const ReactComponent = ${componentName};
					export default ${componentName};
				`;
				return { contents: reactComponent, loader: 'tsx' };
			});
		},
	};
}

// --- Плагин для изображений и шрифтов ---
function assetsPlugin() {
	return {
		name: 'assets',
		setup(build) {
			build.onLoad(
				{ filter: /\.(png|jpg|jpeg|gif|webp|woff|woff2|eot|ttf|otf)$/ },
				(args) => {
					// Копируем файлы в dist
					const relativePath = path.relative(srcPath, args.path);
					const outputPath = path.join(distPath, relativePath);
					fs.mkdirSync(path.dirname(outputPath), { recursive: true });
					fs.copyFileSync(args.path, outputPath);
					return {
						contents: `export default new URL('${relativePath}', import.meta.url).toString()`,
						loader: 'js',
					};
				}
			);
		},
	};
}

// --- Плагин для HTML ---
function htmlPlugin() {
	return {
		name: 'html',
		setup(build) {
			build.onEnd(() => {
				const htmlPath = path.resolve(ROOT_PATH, 'public', 'index.html');
				const distHtmlPath = path.join(distPath, 'index.html');
				if (fs.existsSync(htmlPath)) {
					let html = fs.readFileSync(htmlPath, 'utf8');
					// Вставляем ссылки на бандлы
					if (production) {
						// Для продакшена ищем файлы с хэшами
						const scriptsDir = path.join(distPath, 'scripts');
						const stylesDir = path.join(distPath, 'styles');
						const scripts = fs.existsSync(scriptsDir)
							? fs.readdirSync(scriptsDir).filter((f) => f.endsWith('.js'))
							: [];
						const styles = fs.existsSync(stylesDir)
							? fs.readdirSync(stylesDir).filter((f) => f.endsWith('.css'))
							: [];

						if (scripts.length > 0 || styles.length > 0) {
							// Скрипты — вставляем в конец body
							const scriptsHtml = scripts
								.map(
									(s) => `<script type="module" src="scripts/${s}"></script>`
								)
								.join('\n');
							html = html.replace('</body>', `${scriptsHtml}\n</body>`);

							// CSS — вставляем в head
							const stylesHtml = styles
								.map((s) => `<link rel="stylesheet" href="styles/${s}">`)
								.join('\n');
							html = html.replace('</head>', `${stylesHtml}\n</head>`);

							fs.writeFileSync(distHtmlPath, html);
						}
					} else {
						// Для дев-режима
						html = html.replace(
							'<div id="root"></div>',
							'<div id="root"></div><script src="bundle.js"></script>'
						);
						fs.writeFileSync(distHtmlPath, html);
					}
				}
			});
		},
	};
}

// --- Основная конфигурация esbuild ---
const buildConfig = {
	entryPoints: [path.resolve(srcPath, 'index.tsx')],
	bundle: true,
	sourcemap: production ? false : 'inline', // Отключаем sourcemaps в продакшене
	outdir: distPath,
	minify: production,
	treeShaking: true,
	loader: {
		'.tsx': 'tsx',
		'.ts': 'ts',
		'.jsx': 'jsx',
		'.js': 'js',
		'.css': 'css',
	},
	platform: 'browser',
	target: ['es2020'],
	format: production ? 'esm' : 'iife', // ESM для code splitting
	external: production ? [] : [],
	banner: {
		js: `
			// Environment variables
			const process = {
				env: ${JSON.stringify({
					NODE_ENV: production ? 'production' : 'development',
					...process.env,
				})}
			};
		`,
	},
	// Code splitting для продакшена
	splitting: production,
	// Убираем dead code и unused imports
	pure: production ? ['console.log'] : [],
};

// --- Сборка ---
async function build() {
	console.time('⚡ ESBuild build time');

	try {
		// Удаляем старую dist папку
		if (fs.existsSync(distPath)) {
			fs.rmSync(distPath, { recursive: true, force: true });
		}

		const ctx = await esbuild.context({
			...buildConfig,
			plugins: [
				aliasPlugin(),
				cssModulesPlugin(),
				svgPlugin(),
				assetsPlugin(),
				htmlPlugin(),
			],
		});

		await ctx.rebuild();
		await ctx.dispose();

		// Измеряем размер output
		let totalSize = 0;
		const sizes = [];

		function measureDir(dirPath, prefix = '') {
			const files = fs.readdirSync(dirPath);
			files.forEach((file) => {
				const filePath = path.join(dirPath, file);
				const stat = fs.statSync(filePath);
				if (stat.isDirectory()) {
					measureDir(filePath, prefix + file + '/');
				} else {
					const sizeKB = (stat.size / 1024).toFixed(2);
					totalSize += stat.size;
					sizes.push({ path: prefix + file, size: sizeKB });
				}
			});
		}

		measureDir(distPath);

		console.timeEnd('⚡ ESBuild build time');
		console.log('\n📊 ESBuild Results:');
		console.log(`   Total size: ${(totalSize / 1024).toFixed(2)} KB`);
		console.log('\n📁 Output structure:');
		sizes.sort((a, b) => parseFloat(b.size) - parseFloat(a.size));
		sizes.forEach(({ path, size }) => {
			console.log(`   ${path.padEnd(30)} ${size.padStart(8)} KB`);
		});
	} catch (error) {
		console.error('❌ ESBuild failed:', error);
		process.exit(1);
	}
}

// Запуск
build();

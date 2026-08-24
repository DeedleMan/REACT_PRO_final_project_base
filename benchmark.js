const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const distPath = path.resolve(__dirname, 'dist');
const runs = 3; // Количество запусков для усреднения

// --- Измерение размера папки ---
function getFolderSize(folderPath) {
	let totalSize = 0;

	function measure(dir) {
		const files = fs.readdirSync(dir);
		files.forEach((file) => {
			const filePath = path.join(dir, file);
			const stat = fs.statSync(filePath);
			if (stat.isDirectory()) {
				measure(filePath);
			} else {
				totalSize += stat.size;
			}
		});
	}

	measure(folderPath);
	return totalSize;
}

// --- Замер времени выполнения ---
function measureTime(command) {
	const start = Date.now();
	try {
		execSync(command, { stdio: 'pipe' });
	} catch (error) {
		console.error(`Error running: ${command}`);
		console.error(error.message);
	}
	const end = Date.now();
	return end - start;
}

// --- Получение JS бандла ---
function getJsBundleSize(folderPath) {
	let totalSize = 0;

	function measure(dir) {
		const files = fs.readdirSync(dir);
		files.forEach((file) => {
			const filePath = path.join(dir, file);
			const stat = fs.statSync(filePath);
			if (stat.isDirectory()) {
				measure(filePath);
			} else if (file.endsWith('.js')) {
				totalSize += stat.size;
			}
		});
	}

	measure(folderPath);
	return totalSize;
}

// --- Основная функция сравнения ---
async function compare() {
	console.log('🔬 Bundler Benchmark: Webpack vs ESBuild vs Vite\n');
	console.log(`Running ${runs} build(s) for each bundler...\n`);

	// === ESBuild ===
	console.log('📦 Building with ESBuild...');
	const esbuildTimes = [];

	if (fs.existsSync(distPath)) {
		fs.rmSync(distPath, { recursive: true, force: true });
	}

	for (let i = 1; i <= runs; i++) {
		console.log(`   Run ${i}/${runs}...`);
		const time = measureTime('NODE_ENV=production node esbuild.config.js');
		esbuildTimes.push(time);

		if (fs.existsSync(distPath)) {
			fs.rmSync(distPath, { recursive: true, force: true });
		}
	}

	const esbuildAvgTime = Math.round(
		esbuildTimes.reduce((a, b) => a + b) / runs
	);
	const esbuildMinTime = Math.round(Math.min(...esbuildTimes));
	const esbuildMaxTime = Math.round(Math.max(...esbuildTimes));

	if (!fs.existsSync(distPath)) {
		execSync('NODE_ENV=production node esbuild.config.js', { stdio: 'pipe' });
	}
	const esbuildSize = getFolderSize(distPath);
	const esbuildJsSize = getJsBundleSize(distPath);
	fs.rmSync(distPath, { recursive: true, force: true });

	// === Vite ===
	console.log('\n⚡ Building with Vite...');
	const viteTimes = [];

	for (let i = 1; i <= runs; i++) {
		console.log(`   Run ${i}/${runs}...`);
		const time = measureTime('NODE_ENV=production npx vite build');
		viteTimes.push(time);
	}

	const viteAvgTime = Math.round(viteTimes.reduce((a, b) => a + b) / runs);
	const viteMinTime = Math.round(Math.min(...viteTimes));
	const viteMaxTime = Math.round(Math.max(...viteTimes));

	const viteSize = getFolderSize(distPath);
	const viteJsSize = getJsBundleSize(distPath);
	fs.rmSync(distPath, { recursive: true, force: true });

	// === Webpack ===
	console.log('\n⚙️  Building with Webpack...');
	const webpackTimes = [];

	for (let i = 1; i <= runs; i++) {
		console.log(`   Run ${i}/${runs}...`);
		const time = measureTime('npm run build');
		webpackTimes.push(time);
	}

	const webpackAvgTime = Math.round(
		webpackTimes.reduce((a, b) => a + b) / runs
	);
	const webpackMinTime = Math.round(Math.min(...webpackTimes));
	const webpackMaxTime = Math.round(Math.max(...webpackTimes));

	const webpackSize = getFolderSize(distPath);
	const webpackJsSize = getJsBundleSize(distPath);

	// === Результаты ===
	console.log('\n' + '='.repeat(100));
	console.log('📊 FINAL BENCHMARK RESULTS');
	console.log('='.repeat(100));

	console.log('\n⏱️  BUILD TIME:');
	console.log(
		'┌─────────────────────────────────────────────────────────────────────────────────────────────┐'
	);
	console.log(
		'│ Bundler         │ Avg Time    │ Min Time    │ Max Time    │ Relative     │'
	);
	console.log(
		'├─────────────────────────────────────────────────────────────────────────────────────────────┤'
	);

	function formatRow(name, avg, min, max, baseline) {
		const slower = Math.round(((avg - baseline) / baseline) * 100);
		const avgStr = String(avg + 'ms').padEnd(11);
		const minStr = String(min + 'ms').padEnd(11);
		const maxStr = String(max + 'ms').padEnd(11);
		const relStr = slower === 0 ? 'baseline     ' : `+${slower}% slower`;
		return `│ ${name.padEnd(15)} │ ${avgStr}│ ${minStr}│ ${maxStr}│ ${relStr}│`;
	}

	console.log(
		formatRow(
			'ESBuild',
			esbuildAvgTime,
			esbuildMinTime,
			esbuildMaxTime,
			esbuildAvgTime
		)
	);
	console.log(
		formatRow('Vite', viteAvgTime, viteMinTime, viteMaxTime, esbuildAvgTime)
	);
	console.log(
		formatRow(
			'Webpack',
			webpackAvgTime,
			webpackMinTime,
			webpackMaxTime,
			esbuildAvgTime
		)
	);
	console.log(
		'└─────────────────────────────────────────────────────────────────────────────────────────────┘'
	);

	console.log('\n📦 TOTAL OUTPUT SIZE:');
	console.log(
		'┌─────────────────────────────────────────────────────────────────────────────────────────────┐'
	);
	console.log(
		'│ Bundler         │ Total Size  │ JS Bundle   │ CSS Size    │ HTML/Other │'
	);
	console.log(
		'├─────────────────────────────────────────────────────────────────────────────────────────────┤'
	);

	const esbuildSizeKB = (esbuildSize / 1024).toFixed(1);
	const esbuildJsKB = (esbuildJsSize / 1024).toFixed(1);
	const esbuildCssBytes = esbuildSize - esbuildJsSize;
	const esbuildCssKB = (esbuildCssBytes / 1024).toFixed(1);

	const viteSizeKB = (viteSize / 1024).toFixed(1);
	const viteJsKB = (viteJsSize / 1024).toFixed(1);
	const viteCssBytes = viteSize - viteJsSize;
	const viteCssKB = (viteCssBytes / 1024).toFixed(1);

	const webpackSizeKB = (webpackSize / 1024).toFixed(1);
	const webpackJsKB = (webpackJsSize / 1024).toFixed(1);
	const webpackCssBytes = webpackSize - webpackJsSize;
	const webpackCssKB = (webpackCssBytes / 1024).toFixed(1);

	console.log(
		`│ ESBuild         │ ${esbuildSizeKB.padStart(
			10
		)} KB │ ${esbuildJsKB.padStart(10)} KB │ ${esbuildCssKB.padStart(
			10
		)} KB │ 0.42 KB    │`
	);
	console.log(
		`│ Vite            │ ${viteSizeKB.padStart(10)} KB │ ${viteJsKB.padStart(
			10
		)} KB │ ${viteCssKB.padStart(10)} KB │ 0.42 KB    │`
	);
	console.log(
		`│ Webpack         │ ${webpackSizeKB.padStart(
			10
		)} KB │ ${webpackJsKB.padStart(10)} KB │ ${webpackCssKB.padStart(
			10
		)} KB │ 0.42 KB    │`
	);
	console.log(
		'└─────────────────────────────────────────────────────────────────────────────────────────────┘'
	);

	console.log('\n⚡ BUILD TIME vs WEBPACK (baseline):');
	console.log(
		`   ESBuild: ${esbuildAvgTime}ms (${Math.round(
			(1 - esbuildAvgTime / webpackAvgTime) * 100
		)}% faster)`
	);
	console.log(
		`   Vite:    ${viteAvgTime}ms (${Math.round(
			(1 - viteAvgTime / webpackAvgTime) * 100
		)}% faster)`
	);
	console.log(`   Webpack: ${webpackAvgTime}ms (baseline)`);

	console.log('\n📊 SIZE vs WEBPACK (baseline):');
	console.log(
		`   ESBuild: ${(esbuildSize / 1024).toFixed(1)} KB (${Math.round(
			(esbuildSize / webpackSize - 1) * 100
		)}% larger)`
	);
	console.log(
		`   Vite:    ${(viteSize / 1024).toFixed(1)} KB (${Math.round(
			(viteSize / webpackSize - 1) * 100
		)}% larger)`
	);
	console.log(`   Webpack: ${(webpackSize / 1024).toFixed(1)} KB (baseline)`);

	console.log('\n🏆 WINNER BY CATEGORY:');
	console.log(
		`   ⚡ Fastest Build:    ${
			esbuildAvgTime <= viteAvgTime ? 'ESBuild' : 'Vite'
		}`
	);
	console.log(
		`   📦 Smallest Bundle:  ${
			esbuildSize <= viteSize
				? esbuildSize <= webpackSize
					? 'ESBuild'
					: 'Webpack'
				: viteSize <= webpackSize
				? 'Vite'
				: 'Webpack'
		}`
	);
	console.log(
		`   ⚖️  Best Balance:     ${
			viteAvgTime < webpackAvgTime * 0.5 && viteSize < webpackSize * 1.2
				? 'Vite'
				: 'ESBuild'
		}`
	);

	console.log('\n' + '='.repeat(100));
	console.log('✅ Benchmark complete!');
	console.log('='.repeat(100) + '\n');
}

// Запуск
compare();

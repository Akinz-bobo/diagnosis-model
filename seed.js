const fs = require('fs');
const os = require('os');
const path = require('path');
const { Worker } = require('worker_threads');

const TOTAL_USERS = 5153;
const ACTIVE_USERS = 1322;
const THREAD_COUNT = os.cpus().length; // Use all available CPU cores

const usersPerThread = Math.ceil(TOTAL_USERS / THREAD_COUNT);
let results = [];
let completed = 0;

console.time("Seeding Time");

for (let i = 0; i < THREAD_COUNT; i++) {
  const start = i * usersPerThread;
  const count = Math.min(usersPerThread, TOTAL_USERS - start);

  const worker = new Worker(path.join(__dirname, 'worker.js'), {
    workerData: { startIndex: start, count, activeLimit: ACTIVE_USERS }
  });

  worker.on('message', (data) => {
    results = results.concat(data);
    completed++;
    if (completed === THREAD_COUNT) {
      // Sort to maintain correct order
      results.sort((a, b) => a._index - b._index);
      results = results.map(({ _index, ...user }) => user); // Remove internal index

      fs.writeFileSync('seed.json', JSON.stringify(results, null, 2), 'utf-8');
      console.log(`✅ Successfully wrote ${results.length} users to seed.json`);
      console.timeEnd("Seeding Time");
    }
  });

  worker.on('error', (err) => {
    console.error(`❌ Worker error:`, err);
  });

  worker.on('exit', (code) => {
    if (code !== 0) {
      console.error(`❌ Worker stopped with exit code ${code}`);
    }
  });
}

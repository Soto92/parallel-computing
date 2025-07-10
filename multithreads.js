const {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} = require("worker_threads");
const os = require("os");

const DATA_SIZE = 10_000_000;

const NUM_TASKS = os.cpus().length;

if (!isMainThread) {
  const { sharedBuffer, start, end } = workerData;

  const dataView = new Uint32Array(sharedBuffer);

  let total = 0;
  for (let i = start; i < end; i++) {
    total += dataView[i];
  }

  parentPort.postMessage(total);
}

if (isMainThread) {
  async function run() {
    console.log(
      `Setting up data with ${DATA_SIZE.toLocaleString()} elements...`
    );

    const sharedBuffer = new SharedArrayBuffer(
      DATA_SIZE * Uint32Array.BYTES_PER_ELEMENT
    );
    const data = new Uint32Array(sharedBuffer);

    for (let i = 0; i < DATA_SIZE; i++) {
      data[i] = Math.random() * 10 + 1;
    }

    console.log("Data setup complete. Starting benchmarks.");
    console.log("\n-----------------------------------\n");

    // --- PARALLEL EXECUTION using Worker Threads ---
    console.log(`Running parallel sum with ${NUM_TASKS} workers...`);
    const parallelStartTime = performance.now();

    const workerPromises = [];
    const chunkSize = Math.ceil(DATA_SIZE / NUM_TASKS);

    for (let i = 0; i < NUM_TASKS; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, DATA_SIZE);

      const workerPromise = new Promise((resolve, reject) => {
        const worker = new Worker(__filename, {
          workerData: { sharedBuffer, start, end },
        });

        worker.on("message", resolve);
        worker.on("error", reject);
        worker.on("exit", (code) => {
          if (code !== 0) {
            reject(new Error(`Worker stopped with exit code ${code}`));
          }
        });
      });

      workerPromises.push(workerPromise);
    }

    const partialSums = await Promise.all(workerPromises);
    const parallelTotal = partialSums.reduce(
      (acc, partial) => acc + partial,
      0
    );
    const parallelTimeMs = performance.now() - parallelStartTime;

    console.log(`Parallel Total: ${parallelTotal}`);
    console.log(`Parallel Execution Time: ${parallelTimeMs.toFixed(4)} ms`);

    console.log("\n-----------------------------------\n");

    // --- SINGLE-THREADED EXECUTION for comparison ---
    console.log("Running single-threaded sum...");
    const serialStartTime = performance.now();

    let serialTotal = 0;
    for (let i = 0; i < data.length; i++) {
      serialTotal += data[i];
    }

    const serialTimeMs = performance.now() - serialStartTime;
    console.log(`Serial Total:   ${serialTotal}`);
    console.log(`Serial Execution Time: ${serialTimeMs.toFixed(4)} ms`);
    console.log("");
  }

  run().catch(console.error);
}

/** Results:
 * node .\multithreads.js
Setting up data with 10.000.000 elements...
Data setup complete. Starting benchmarks.

-----------------------------------

Running parallel sum with 16 workers...
Parallel Total: 54997825
Parallel Execution Time: 65.2224 ms

-----------------------------------

Running single-threaded sum...
Serial Total:   54997825
Serial Execution Time: 10.7772 ms
 */

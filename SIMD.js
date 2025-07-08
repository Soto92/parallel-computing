/**
 * SIMD (Single Instruction, Multiple Data) in JavaScript (Corrected Benchmark)
 *
 * This corrected example demonstrates the performance difference between a
 * traditional "scalar" approach using standard JavaScript Arrays and a
 * "vectorized" approach using highly optimized Typed Arrays (Float32Array).
 *
 * The JavaScript engine's JIT (Just-In-Time) compiler can often use
 * hardware SIMD instructions on Typed Arrays, but not on standard arrays
 * because their type and memory layout are not predictable.
 *
 * We will implement a simple algorithm: adding two vectors (arrays) together.
 * C[i] = A[i] + B[i]
 */

// 1. Scalar Approach (Using Standard Arrays)
function scalarAdd(vecA, vecB) {
  const result = []; // Use a standard array
  for (let i = 0; i < vecA.length; i++) {
    result[i] = vecA[i] + vecB[i];
  }
  return result;
}

// 2. Vectorized Approach (Using Typed Arrays)
function vectorizedAdd(vecA, vecB) {
  const result = new Float32Array(vecA.length);
  for (let i = 0; i < vecA.length; i++) {
    result[i] = vecA[i] + vecB[i];
  }
  return result;
}

const size = 5_000_000;
console.log(`Setting up arrays with ${size.toLocaleString()} elements...`);

const standardArrayA = [];
const standardArrayB = [];

const typedArrayA = new Float32Array(size);
const typedArrayB = new Float32Array(size);

for (let i = 0; i < size; i++) {
  const randA = Math.random() * 10;
  const randB = Math.random() * 10;
  standardArrayA.push(randA);
  standardArrayB.push(randB);
  typedArrayA[i] = randA;
  typedArrayB[i] = randB;
}

console.log("Setup complete. Starting benchmarks...\n");

// Benchmark the Scalar approach
console.time("Scalar Add (Standard Array) Execution Time");
const scalarResult = scalarAdd(standardArrayA, standardArrayB);
console.timeEnd("Scalar Add (Standard Array) Execution Time");
console.log(
  `Scalar Result (first 5): [${scalarResult.slice(0, 5).join(", ")}]`
);

console.log("\n-----------------------------------\n");

// Benchmark the Vectorized
console.time("Vectorized Add (TypedArray) Execution Time");
const vectorizedResult = vectorizedAdd(typedArrayA, typedArrayB);
console.timeEnd("Vectorized Add (TypedArray) Execution Time");
console.log(
  `Vectorized Result (first 5): [${vectorizedResult.slice(0, 5).join(", ")}]`
);

/** Results:
node SIMD
Setting up arrays with 5.000.000 elements...
Setup complete. Starting benchmarks...

Scalar Add (Standard Array) Execution Time: 48.33ms
Scalar Result (first 5): [13.66825545487027, 1.050004930550379, 11.318136941424768, 8.897541339706603, 4.25306560905266]

-----------------------------------

Vectorized Add (TypedArray) Execution Time: 9.709ms
Vectorized Result (first 5): [13.668254852294922, 1.0500049591064453, 11.318137168884277, 8.897541046142578, 4.253065586090088]
 */

'use strict';

// JS-18 Exercises — run with: node exercises.js
// Fill in each TODO. Assertions are provided as executable acceptance criteria.
const assert = require('node:assert/strict');

const delay = (value, ms) => new Promise((resolve) => setTimeout(() => resolve(value), ms));

// Exercise 1 — async return and rejection
// TODO: Return { id: 7 } when id === 7; otherwise throw Error('INVALID_ID').
async function getUser(id) {
  throw new Error('TODO_EXERCISE_1');
}

// Exercise 2 — concurrency
// TODO: Start both independent calls together using Promise.all, then return
// { user, products }. Do not call one after awaiting the other.
async function getDashboard(getUserFn, getProductsFn) {
  throw new Error('TODO_EXERCISE_2');
}

// Exercise 3 — partial failures
// TODO: Use Promise.allSettled to return
// { user: value or null, products: value or null, errors: [message, ...] }.
// Report failures in errors instead of silently pretending the data is empty.
async function getPartialDashboard(getUserFn, getProductsFn) {
  throw new Error('TODO_EXERCISE_3');
}

// Exercise 4 — timeout
// TODO: Race callProvider() against a rejecting timer using timeoutMs.
// A timeout must reject with Error('TIMEOUT').
// Cancellation and timer cleanup are intentionally deferred to a later topic.
async function analyzeWithTimeout(callProvider, timeoutMs) {
  throw new Error('TODO_EXERCISE_4');
}

async function runTests() {
  assert.deepEqual(await getUser(7), { id: 7 });
  await assert.rejects(getUser(-1), /INVALID_ID/);

  let userStarted = false;
  let productsSawUserStarted = false;
  const dashboard = await getDashboard(
    () => { userStarted = true; return delay({ id: 1 }, 20); },
    () => { productsSawUserStarted = userStarted; return delay(['Laptop'], 10); }
  );
  assert.equal(productsSawUserStarted, true);
  assert.deepEqual(dashboard, { user: { id: 1 }, products: ['Laptop'] });

  const partial = await getPartialDashboard(
    () => Promise.resolve({ id: 1 }),
    () => Promise.reject(new Error('PRODUCT_FAILED'))
  );
  assert.deepEqual(partial, {
    user: { id: 1 },
    products: null,
    errors: ['PRODUCT_FAILED'],
  });

  assert.equal(await analyzeWithTimeout(() => delay('AI_OK', 5), 50), 'AI_OK');
  await assert.rejects(
    analyzeWithTimeout(() => delay('LATE', 50), 5),
    /TIMEOUT/
  );
  console.log('All JS-18 exercises passed.');
}

runTests().catch((error) => {
  console.error('Exercise failed:', error.message);
  process.exitCode = 1;
});

'use strict';

const delay = (value, ms) => new Promise((resolve) => setTimeout(() => resolve(value), ms));

async function asyncAndAwait() {
  console.log('1. async/await');
  async function getPlant() { return { name: 'Rose' }; }
  console.log((await getPlant()).name);
}

async function errorPropagation() {
  console.log('2. error propagation');
  async function repository() { throw new Error('DB_FAILED'); }
  async function useCase() { return repository(); }
  try { await useCase(); } catch (error) { console.log(error.message); }
}

async function concurrentCalls() {
  console.log('3. concurrent operations');
  const [user, products] = await Promise.all([
    delay({ id: 1 }, 30),
    delay(['Laptop'], 15),
  ]);
  console.log(user.id, products[0]);
}

async function allSettledExample() {
  console.log('4. allSettled');
  const results = await Promise.allSettled([
    Promise.resolve('USER_OK'),
    Promise.reject(new Error('PRODUCT_FAILED')),
  ]);
  console.log(results[0].value, results[1].reason.message);
}

async function raceExample() {
  console.log('5. race');
  const winner = await Promise.race([delay('SLOW', 30), delay('FAST', 10)]);
  console.log(winner);
}

async function anyExample() {
  console.log('6. any');
  const winner = await Promise.any([
    Promise.reject(new Error('PROVIDER_A_FAILED')),
    delay('PROVIDER_B_OK', 10),
  ]);
  console.log(winner);
}

async function main() {
  await asyncAndAwait();
  await errorPropagation();
  await concurrentCalls();
  await allSettledExample();
  await raceExample();
  await anyExample();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

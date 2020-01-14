'use strict'

const db = require('../server/db')
const {User, Order, OrderItem, Item} = require('../server/db/models')

async function seed() {
  await db.sync({force: true})
  console.log('db synced!')

  const users = await Promise.all([
    User.create({email: 'cody@email.com', password: '123'}),
    User.create({email: 'murphy@email.com', password: '123'})
  ])

  const items = await Promise.all([
    Item.create({name: 'Amulet of Health', price: 100, inventory: 1}),
    Item.create({name: 'Ammunition', price: 20, inventory: 10}),
    Item.create({name: 'Armor of Gleaming', price: 10, inventory: 20})
  ])

  const orders = await Promise.all([
    Order.create({userId: 1}),
    Order.create({userId: 2}),
    Order.create({userId: 2})
  ])

  const orderItems = await Promise.all([
    OrderItem.create({price: 10, quantity: 2, orderId: 1, itemId: 3}),
    OrderItem.create({price: 100, quantity: 1, orderId: 1, itemId: 1})
  ])

  orders[0].total = await orders[0].calculateTotal()

  console.log(`seeded successfully`)
}

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed()
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed

import { log } from '../../middlewares/logger.middleware.mjs'
import { dbService } from '../../services/db.service.mjs'
import { logger } from '../../services/logger.service.mjs'
import { utilService } from '../../services/util.service.mjs'
import mongodb from 'mongodb'
const { ObjectId } = mongodb


async function query() {
  try {
    const collection = await dbService.getCollection('order')
    const orders = await collection.toArray()
    console.log('orders:', orders)
    return orders
  } catch (err) {
    logger.error('cannot find orders', err)
    throw err
  }
}

async function getById(orderId) {
  try {

    const collection = await dbService.getCollection('order')
    const order = collection.findOne({ _id: ObjectId(orderId) })
    return order
  } catch (err) {
    logger.error(`while finding order ${orderId}`, err)
    throw err
  }
}

async function remove(orderId) {
  try {
    const collection = await dbService.getCollection('order')
    await collection.deleteOne({ _id: ObjectId(orderId) })
    return orderId
  } catch (err) {
    logger.error(`cannot remove order ${orderId}`, err)
    throw err
  }
} 

async function add(order) {
  try {
    const collection = await dbService.getCollection('order')
    await collection.insertOne(order)
    return order
  } catch (err) {
    logger.error('cannot insert order', err)
    throw err
  }
}

async function update(order) {
  try {
    const orderToSave = {
      vendor: order.vendor,
      price: order.price,
    }
    const collection = await dbService.getCollection('order')
    await collection.updateOne(
      { _id: ObjectId(order._id) },
      { $set: orderToSave }
    )
    return order
  } catch (err) {
    logger.error(`cannot update order ${orderId}`, err)
    throw err
  }
}

async function addOrderMsg(orderId, msg) {
  try {
    msg.id = utilService.makeId()
    const collection = await dbService.getCollection('order')
    await collection.updateOne(
      { _id: ObjectId(orderId) },
      { $push: { msgs: msg } }
    )
    return msg
  } catch (err) {
    logger.error(`cannot add order msg ${orderId}`, err)
    throw err
  }
}

async function removeOrderMsg(orderId, msgId) {
  try {
    const collection = await dbService.getCollection('order')
    await collection.updateOne(
      { _id: ObjectId(orderId) },
      { $pull: { msgs: { id: msgId } } }
    )
    return msgId
  } catch (err) {
    logger.error(`cannot add order msg ${orderId}`, err)
    throw err
  }
}



export const orderService = {
  remove,
  query,
  getById,
  add,
  update,
  addOrderMsg,
  removeOrderMsg,
}

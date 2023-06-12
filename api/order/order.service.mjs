import { log } from '../../middlewares/logger.middleware.mjs'
import { dbService } from '../../services/db.service.mjs'
import { logger } from '../../services/logger.service.mjs'
import { utilService } from '../../services/util.service.mjs'
import mongodb from 'mongodb'
const { ObjectId } = mongodb


async function query(filterBy) {

  const criteria = {}
  if (filterBy.status) criteria.status = filterBy.status

  try {
    const collection = await dbService.getCollection('order')
    const orders = await collection.find(criteria).toArray()
    // const orders = await collection.toArray()
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
  console.log('order from service', order)
  try {
    const orderToSave = setOrderToSave(order)
    const collection = await dbService.getCollection('order')
    await collection.updateOne(
      { _id: ObjectId(order._id) },
      { $set: orderToSave }
    )
    return order
  } catch (err) {
    logger.error(`cannot update order ${order._id}`, err)
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

function setOrderToSave(order) {
  const orderToSave = {
    status: order.status,
    createdAt: order.createdAt,
    buyer: order.buyer,
    seller: order.seller,
    totalPrice: order.totalPrice,
    items: order.items,
    msgs: order.msgs,
  }
  return orderToSave
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

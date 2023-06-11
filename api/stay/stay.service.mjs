import { log } from '../../middlewares/logger.middleware.mjs'
import { dbService } from '../../services/db.service.mjs'
import { logger } from '../../services/logger.service.mjs'
import { utilService } from '../../services/util.service.mjs'
import mongodb from 'mongodb'
const { ObjectId } = mongodb

const PAGE_SIZE = 3

function _buildCriteria(filterBy) {
  const criteria = {
    name: { $regex: filterBy.txt, $options: 'i' },
    $or: [
      { 'loc.city': { $regex: filterBy.location, $options: 'i' } },
      { 'loc.country': { $regex: filterBy.location, $options: 'i' } }
    ],
    capacity: { $gte: filterBy.guests },
    type: { $regex: filterBy.type, $options: 'i' }

  }
  return criteria
}
async function query(filterBy) {n
  try {
    const criteria = _buildCriteria(filterBy)
    const collection = await dbService.getCollection('stay_collection')
    var stayCursor = await collection.find(criteria)

    // if (filterBy.pageIdx !== undefined) {
    //   stayCursor.skip(filterBy.pageIdx * PAGE_SIZE).limit(PAGE_SIZE)
    // }

    const stays = await stayCursor.toArray()
    return stays
  } catch (err) {
    logger.error('cannot find stays', err)
    throw err
  }
}

async function getById(stayId) {
  try {
    const collection = await dbService.getCollection('stay_collection')
    const stay = collection.findOne({ _id: ObjectId(stayId) })
    return stay
  } catch (err) {
    logger.error(`while finding stay ${stayId}`, err)
    throw err
  }
}

async function remove(stayId) {
  try {
    const collection = await dbService.getCollection('stay_collection')
    await collection.deleteOne({ _id: ObjectId(stayId) })
    return stayId
  } catch (err) {
    logger.error(`cannot remove stay ${stayId}`, err)
    throw err
  }
}

async function add(stay) {
  try {
    const collection = await dbService.getCollection('stay_collection')
    await collection.insertOne(stay)
    return stay
  } catch (err) {
    logger.error('cannot insert stay', err)
    throw err
  }
}

async function update(stay) {
  try {
    const stayToSave = {
      vendor: stay.vendor,
      price: stay.price,
    }
    const collection = await dbService.getCollection('stay_collection')
    await collection.updateOne(
      { _id: ObjectId(stay._id) },
      { $set: stayToSave }
    )
    return stay
  } catch (err) {
    logger.error(`cannot update stay ${stayId}`, err)
    throw err
  }
}

async function addStayMsg(stayId, msg) {
  try {
    msg.id = utilService.makeId()
    const collection = await dbService.getCollection('stay_collection')
    await collection.updateOne(
      { _id: ObjectId(stayId) },
      { $push: { msgs: msg } }
    )
    return msg
  } catch (err) {
    logger.error(`cannot add stay msg ${stayId}`, err)
    throw err
  }
}

async function removeStayMsg(stayId, msgId) {
  try {
    const collection = await dbService.getCollection('stay_collection')
    await collection.updateOne(
      { _id: ObjectId(stayId) },
      { $pull: { msgs: { id: msgId } } }
    )
    return msgId
  } catch (err) {
    logger.error(`cannot add stay msg ${stayId}`, err)
    throw err
  }
}



export const stayService = {
  remove,
  query,
  getById,
  add,
  update,
  addStayMsg,
  removeStayMsg,
}

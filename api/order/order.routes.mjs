
import express from 'express'
import { requireAuth } from '../../middlewares/requireAuth.middleware.mjs'
import { log } from '../../middlewares/logger.middleware.mjs'

import {getOrders, addOrder, removeOrder, updateOrder, addOrderMsg,removeOrderMsg } from './order.controller.mjs'
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getOrders)
router.post('/',  log, requireAuth, addOrder)
router.put('/:id', log, requireAuth, updateOrder)
router.delete('/:id', requireAuth, removeOrder)

router.post('/:id/msg', requireAuth, addOrderMsg)
router.delete('/:id/msg/:msgId', requireAuth, removeOrderMsg)
// module.exports = router

export const orderRoutes = router

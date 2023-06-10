import { httpService } from './http.service.js'
import { utilService } from './util.service.js'

export const stayService = {
  query,
  getById,
  save,
  remove,
  getEmptyStay,
  addStayMsg,
}
window.cs = stayService

async function query(filterBy = { txt: '', price: 0 }) {
  return httpService.get('stay', filterBy)
}
function getById(stayId) {
  return httpService.get(`stay/${stayId}`)
}

async function remove(stayId) {
  return httpService.delete(`stay/${stayId}`)
}
async function save(stay) {
  var savedStay
  if (stay._id) {
    savedStay = await httpService.put(`stay/${stay._id}`, stay)
  } else {
    savedStay = await httpService.post('stay', stay)
  }
  return savedStay
}

async function addStayMsg(stayId, txt) {
  const savedMsg = await httpService.post(`stay/${stayId}/msg`, { txt })
  return savedMsg
}

function getEmptyStay() {
  const stay = {
    name: '',
    type: '',
    imgUrls: '',
    price: '',
    summary: '',
    capacity: '',
    amenities: [],
    labels: [],
    host: {
      _id: 'u101',
      fullname: 'Davit Pok',
      imgUrl: '',
    },
    loc: {
      country: '',
      countryCode: '',
      city: '',
      address: '',
      lat: '',
      lng: '',
    },
    reviews: [],
    likedByUsers: [],
  }

  return stay
}


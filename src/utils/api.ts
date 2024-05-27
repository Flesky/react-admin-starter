import { ofetch } from 'ofetch'

const api = ofetch.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
})

export default api

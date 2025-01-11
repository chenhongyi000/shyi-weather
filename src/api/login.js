import request from '../utils/request'

export const login = (data) => {
  return request.get('/login', data)
}

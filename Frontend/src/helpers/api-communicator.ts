import axios from "axios"

export const loginUser = async (email:string, password:string) => {
  const res = await axios.post('/user/login', {email, password})
  if(res.status!== 200) throw new Error('Unable to login')
  
  const data = await res.data
  return data
}

//figure out why we are getting undefined instead of user info
export const checkAuthStatus = async () => {
  const res = await axios.get('/user/auth-status')
  if(res.status!== 200) throw new Error('Unable to authenticate')

  const data = await res.data
  return data
}
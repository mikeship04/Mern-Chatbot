export const COOKIE_NAME = 'auth_token'
export const COOKIE_PARAMS = {
  path: "/", 
  domain: "localhost", 
  httpOnly: true, 
  signed: true
}

export const LogError = (res, error) => {
  console.log(error);
  return res.status(400).json({ message: "ERROR", cause: error.message });
}
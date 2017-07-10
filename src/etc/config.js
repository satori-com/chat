export default {
  // RTM endpoint URL
  endpoint: process.env.REACT_APP_ENDPOINT,

  // RTM public appkey
  appkey: process.env.REACT_APP_APPKEY,

  // RTM user role
  role: process.env.REACT_APP_ROLE,

  // RTM user role secret key
  roleSecret: process.env.REACT_APP_ROLE_SECRET,

  // Number of channel's history items
  historyMaxAge: Number(process.env.REACT_APP_HISTORY_MAX_AGE),

  useGeolocation: process.env.REACT_APP_USE_GEOLOCATION === 'true',
};

const HW = require('./index')
const hw = new HW(username, password)

hw.login()
  .then(hw.getStatus)
  .then(data => console.log(data))

const roleRoute = require('./rolePermissions')
const authRoute = require('./auth')
const globalTypeCategory = require('./globalTypeCategory')
const globalType = require('./globalType')
const employeeRoute = require('./employee')
const staticContent = require('./staticContent')
const eventRoute = require('./events')
// const saveFormDataRoute = require('./saveFormData')

module.exports = {
  roleRoute,
  authRoute,
  globalTypeCategory,
  globalType,
  employeeRoute,
  staticContent,
  eventRoute,
  // saveFormDataRoute,
}

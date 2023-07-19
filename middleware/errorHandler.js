const { logEvents } = require('./logEvents')

const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}`, 'errorLog.txt')
    console.log(err)
    res.status(500).send(err.message)
}

module.exports = errorHandler
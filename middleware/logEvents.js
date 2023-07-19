const { compareAsc, format } = require('date-fns');
const { v4: uuid } = require('uuid')

const fs = require("fs");
const path = require('path');
const fsPromise = require("fs").promises


const logEvents = async (msg, logName) => {
    const dateTime = `${format(new Date(), 'dd-MMM-yyy\thh:mm:ss')}`
    const logItem = `${dateTime}\t${uuid()}\t${msg}\n`

    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromise.mkdir(path.join(__dirname,  '..', 'logs'))
        }

        await fsPromise.appendFile(path.join(__dirname,  '..', 'logs', logName), logItem)
        // console.log(logItem)
    } catch (error) {
        console.error(error)
    }

}

const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt')
    next()
}


module.exports = { logEvents , logger}
/**
 *  author: nupamore
 *    note: express server
 */

const express = require('express')
const bodyParser = require('body-parser')
// const external = require('./sensors/etc')
// external.init()

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('view'))


let sleepMode = 'off'
let securityMode = 'off'


/**
 * alarm
 */
app.get('/alarm', (req, res) => {
})

app.post('/alarm', (req, res) => {
})

/**
 * sleep
 */
app.get('/sleep', (req, res) => {
  res.send(sleepMode)
})

app.get('/sleep/:day', (req, res) => {
})

app.post('/sleep/:onoff', (req, res) => {
  sleepMode = req.params.onoff
  console.log(`sleepMode = ${sleepMode}`)
  res.sendStatus(200)
})

app.put('/sleep', (req, res) => {
  console.log(req.body)
  res.sendStatus(200)
})

/**
 * security
 */
app.get('/security', (req, res) => {
  res.send(securityMode)
})

app.post('/security/:onoff', (req, res) => {
  securityMode = req.params.onoff
  console.log(`securityMode = ${securityMode}`)
  res.sendStatus(200)
})

app.put('/security', (req, res) => {
  console.log(req.body)
  res.sendStatus(200)
})


app.listen(17919, () => {
  console.log('http://localhost:17919')
})

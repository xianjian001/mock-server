/**
 * Created by wangxuanbo on 2019/8/2.
 */
const express = require('express')
const path = require('path')
const fs = require('fs')
const Mock = require('mockjs')

const app = express()
const port = 5050
const apiPath = path.join(__dirname, './api.json')
let apiData = {}

app.listen(port, function () {
  console.log(`mock server is listening at ${port}`)
})
let getApi = () => {
  let readStream = fs.createReadStream(apiPath, {
    encoding: 'utf8'
  })

  readStream.on('data', (chunk) => {
    apiData = JSON.parse(chunk)
  })

  readStream.on('end', () => {
    console.info('读取文件完成..')
  })
}

fs.watchFile(apiPath, () => {
  getApi();
  console.info('mock server update')
})

getApi();

app.use((req, res, next) => {
  const originalUrl = req.originalUrl
  let data = void 0

  let findItem = apiData.find(result => {
    if (result.url === originalUrl) {
      return result
    }
  })

  if (findItem !== void 0) {
    data = Mock.mock(findItem.res)
  }


  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS')
  res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, access-token')

  data !== void 0 ? res.send(data) : res.sendStatus(404)
  next()
})

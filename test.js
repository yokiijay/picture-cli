// const Configstore = require('configstore')
// const {name} = require('./package.json')

// const config = new Configstore(name, {foo:'bar'})

// config.clear()

// console.log( config.get('name') )

// const axios = require('axios')

// axios.get('http://www.baidu.com').then(data=>console.log( data ))

const fs = require('fs-extra')
const FormData = require('form-data')
const axios = require('axios')

const form = new FormData()
const API_TOKEN = 'm3VwKhANsRktICy3BN3uh3Tf3wzjE3f8'

form.append('smfile', fs.createReadStream('/Users/yokiijay/Code/picture-cli/demo-img.jpg'))

axios.get('https://i.loli.net/2020/06/01/6t5ZykFLBP7sp9c.jpg').then(res=>console.log( res ))

// axios({
//   method: 'POST',
//   url: 'https://sm.ms/api/v2/upload',
//   headers: {
//     'Authorization': API_TOKEN,
//     ...form.getHeaders()
//   },
//   data: form
// }).then(res=>console.log( res )).catch(err=>console.log( err ))
const prompts = require('prompts')
const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs-extra')
const isZh = require('../utils/isZh')
const { Signale } = require('signale')
const clipboardy = require('clipboardy')
const chalk = require('chalk')
const ora = require('ora')
const http = require('http')
const https = require('https')

const API_TOKEN = 'm3VwKhANsRktICy3BN3uh3Tf3wzjE3f8'

const form = new FormData()

const signale = new Signale({
  types: {
    success: {
      badge: '🎉',
      label: `success`.zh('成功')
    }
  }
})

// const httpPromise = (url)=>{
//   const request = url.includes('https') ? https : http
//   return new Promise(resolve=>{
//     request.request(url, res=>{
//       resolve(res)
//     })
//   })
// }

const formatPath = (path='')=>{
  return path.replace(/(\'|\")/g,'').trim()
}

const upload = async ()=>{
  try {
    const {path=''} = await prompts({
      type: 'text',
      name: 'path',
      message: 'Local image filepath:'.zh('本地图片路径:'),
      onState(state){
        this.rendered = formatPath(state.value)
        this._value = formatPath(state.value)
      }
    }, {
      onCancel(){
        console.clear()
        process.exit()
      }
    })

    // 如果路径不存在则抛出错误
    const pathExists = await fs.pathExists(path)
    if(!pathExists) throw Error(`File doesn't exist or wrong path provided.`.zh('文件不存在或路径错误'))

    form.append('smfile', fs.createReadStream(path))

    // uploading
    console.clear()
    const spinner = ora(`🍵 Uploading...`.zh(`🍵 上传中，马上好...`)).start()

    const res = await axios({
      method: 'POST',
      url: 'https://sm.ms/api/v2/upload',
      headers: {
        'Authorization': API_TOKEN,
        ...form.getHeaders()
      },
      data: form
    })

    // 已上传完
    spinner.stop()
    const {data} = res

    // 如果上传失败
    if(!data.success){
      spinner.stop()
      // 如果重复图片
      if(data.code === 'image_repeated') {
        signale.warn(chalk.gray(`This image is already exist at ${data.images}`.zh(`图片已经存在了不用重复提交 地址：${data.images}`)))
        clipboardy.writeSync(data.images)
        signale.success(chalk`Copied image URL: {cyan.inverse ${data.images}}`.zh(chalk`已拷贝图片链接：{cyan.inverse ${data.images}}`))
        return
      }
      throw Error(data.message || 'Upload failed, something went wrong, please try again.'.zh('上传失败了，再试一下呗。'))
    }

    // 上传成功
    const {data:imgData} = data
    // signale.info('\n'+chalk.gray(JSON.stringify(imgData)))
    // process.stdout.write('\n\n')
    clipboardy.writeSync(imgData.url)
    signale.success(chalk`Uploaded and copied image as URL: {cyan.inverse ${imgData.url}}`.zh(chalk`已上传并拷贝图片链接到剪切板 URL：{cyan.inverse ${imgData.url}}`))



  } catch (err) {
    signale.error(err)
    process.exit()
  }

}

module.exports = upload
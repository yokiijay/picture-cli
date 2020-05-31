#!/usr/bin/env node
const yargs = require('yargs')
const generate = require('../src/actions/generate')
const isZh = require('../src/utils/isZh')
const prompts = require('prompts')
const Configstore = require('configstore')
const {name,version,description} = require('../package.json')
const upload = require('../src/actions/upload')

// 退出事件
process.on('SIGINT', ()=>{
  process.exit()
})

const config = new Configstore(name, {name,version,description})

const usage = isZh ?
`🎉强大的图片工具，快尝试输入 'picture' 吧`
:
`🎉A powerful image tool, just input 'picture' to give a try!`

const argv = yargs
.usage(usage)
.alias('v', 'version')
.alias('h', 'help')
.argv

// 如果输入了picture xxx则弹help 并结束程序
argv._.length && yargs.showHelp() && process.exit()

// 如果只输入了picture则进入程序
{(async ()=>{
  const ans = await prompts([
    {
      type: 'select',
      name: 'action',
      message: 'Choose one to use'.zh('选择一个功能'),
      choices: [
        {title: 'Generate random pictures'.zh('随机生成图片'), value: 'generate'},
        {title: 'Upload picture online'.zh('上传图片到线上'), value: 'upload', description: 'input picture src then will upload and return an online url'.zh('上传后返回一个线上的URL')},
      ],
      initial: config.get('choose') || 0
    }
  ])

  // 选择功能
  switch(ans.action){
    case 'generate': 
      config.set('choose', 0)
      return generate() //随机生成图片
    case 'upload':
      config.set('choose', 1)
      return upload() //上传图片
    default: return
  }

})()}
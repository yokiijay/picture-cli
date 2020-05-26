#!/usr/bin/env node
const { program } = require('commander')
const fetch = require('node-fetch')
const chalk = require('chalk')
const prompts = require('prompts')
const signale = require('signale')
const ora = require('ora')
const clipboardy = require('clipboardy')
const configstore = require('configstore')

program.version('0.0.1', '-v --vers', '打印当前版本')
program.description('一个随机图片生成器')


/** Usage:
 * pic
 * 你想要多少图片 10
 * 图片的宽度
 * 图片的高度
 */
program
  .option('set delay <ms>', 'set the delay of each generation')

program.parse(process.argv)
// if(program.args.length){
//   const [] = program.args
// }

if(!program.args.length) question()

async function question(){
  const ans = await prompts([
    {
      type: 'number',
      name: 'count',
      message: 'How many pictures you need?',
      initial: 1,
      min: 1
    },
    {
      type: 'number',
      name: 'width',
      message: "Width:",
      initial: `input number or 'enter' to skip`,
      format: val => isNaN(val) ? null : val,
      onState(state){
        if(state.value === -Infinity || isNaN(state.value) ){
          this.rendered = 300
          this.value = 300
        }
      }
    },
    {
      type: 'number',
      name: 'height',
      message: "Height:",
      initial: `input number or 'enter' to skip`,
      format: val => isNaN(val) ? null : val,
      onState(state){
        if(state.value === -Infinity || isNaN(state.value) ){
          this.rendered = 300
          this.value = 300
        }
      }
    },
  ])

  const { count, width, height } = ans

  // 通过网络获取图片
  // fetchPictures(count, width, height)

  // 不通过网络生成图片
  generatePictures(count, width, height)

}

// 获取图片
async function fetchPictures(count, width, height){
  let pictures = []
  const spinner = ora().start()

  for(let i=0;i<count;i++){
    try {
      spinner.text = `Loading ${i+1>=count ? 'last' : i+1} pic`
      const { url } = await fetch(`https://picsum.photos/${width?width:300}/${height?height:300}`)
      pictures.push(url)

      // 加载完
      if(i+1>=count){
        spinner.stop()
        
        pictures.unshift('⬇️⬇️⬇️ Here yo go ⬇️⬇️⬇️')
        console.table(pictures)

        signale.complete(`Success loaded ${count} pictures`)

        pictures.shift()
        clipboardy.writeSync(JSON.stringify(pictures))
        return signale.success(`🌈 Saved to clipboard 🌈 `)
      }
    } catch (err) { i-- }

    // await delay(200)
  }
}


async function generatePictures(count, width, height){
  const spinner = ora('Loading').start()
  let seeds = []
  let urls = []

  const generateUrl = (seed, width, height)=> `https://picsum.photos/seed/${seed}/${width}/${height}`
  
  const handlePush = (seed, width, height)=>{
    seeds.push(seed)
    urls.push(generateUrl(seed, width, height))
    spinner.clear()
    signale.complete({prefix: urls.length, message: generateUrl(seed, width, height)})
  }

  const handleEnd = async()=>{
    spinner.stop()
    signale.success(`🌈🌈 All ${urls.length} pictures loaded!`)
    const ans = await prompts([
      {
        type: 'select',
        name: 'method',
        message: 'Copy to clipboard as',
        choices: [
          { title: 'Array', description: JSON.stringify(urls).slice(0,40)+'...', value: JSON.stringify(urls) },
          { title: 'HTML Tag', description: urls.map(url=>`<li><img src="${url}" alt=""/></li>`).join('').slice(0,40)+'...', value: urls.map(url=>`<li><img src="${url}" alt=""/></li>\n`).join('') }
        ]
      }
    ])
    
    clipboardy.writeSync(ans.method)
    console.log( chalk.bgBlueBright.black(ans.method) )
    signale.success('🌈🌈 Copied to your clipboard~~')
  }

  for(let i=0;i<count;i++){
    spinner.text = i===count-2 ? 'Loading last picture':`Loading ${i+2} picture`

    let seed = randomNum([1, count*100])
    while(seeds.includes(seed)){
      seed = randomNum([1, count*100])
    }

    handlePush(seed, width, height)

    // 结束或者delay下一个
    if(i>=count-1) {
      return handleEnd()
    }else {
      await delay(1)
    }
  }
}

// 生成范围内随机的整数
function randomNum([a,b]){
  const max = Math.max(a,b)
  const min = Math.min(a,b)

  return Math.round(Math.random()*(max-min)+min)
}

// 节流防抖
function delay(ms){
  return new Promise((res)=>{
    setTimeout(() => {
      res()
    }, ms)
  })
}
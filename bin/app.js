#!/usr/bin/env node
const { program } = require('commander')
const generate = require('../src/actions/generate')
const isZh = require('../src/utils/isZh')

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

if(!program.args.length) generate()
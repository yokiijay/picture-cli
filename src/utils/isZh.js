module.exports = (()=>{
  String.prototype.zh = function(zhStr){
    const isZh = process.env.LANG.includes('zh_CN')
    return isZh ? zhStr : this
  }
  return process.env.LANG.includes('zh_CN')
})()
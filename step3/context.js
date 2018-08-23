let context = {
}
//可读可写
function access(target,property){
   Object.defineProperty(context,property,{
        get(){
            return this[target][property]
        },
        set(value){
            this[target][property]=value
        }
   })
}
//只可读
function getter(target,property){
   Object.defineProperty(context,property,{
        get(){
            return this[target][property]
        }
   })
}
getter('request','headers')
access('response','body')
module.exports =  context
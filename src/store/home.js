import {config} from '../config.js'
console.log(config)
var host = config.host
let list = host + '/api/get-list.html'

export {list}

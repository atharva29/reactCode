export function addData(obj){
  return {
    type: "ADD_DATA" ,
    obj 
  }
}

export function allData(obj) {
  return {
    type: "ALL_DATA",
    obj
  }
}

export function storeWebsocketConnection(obj) {
  return {
    type: "WEBSOCKET_CONNECTION",
    obj
  }
}
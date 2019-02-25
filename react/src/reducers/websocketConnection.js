export default (state = {}, action) => {
  switch (action.type) {

    case 'WEBSOCKET_CONNECTION': {
      return action.obj ;
    }
    default: {
      return state;
    }
  }
}


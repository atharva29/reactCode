export default (state = [] , action) => {
  switch (action.type) {

    case 'ALL_DATA': {
    let arr = state.slice();
      arr = arr.reverse();
      arr.push(action.obj);
      return arr.reverse()
    
    }
    default: {
      return state;
    }
  }
}


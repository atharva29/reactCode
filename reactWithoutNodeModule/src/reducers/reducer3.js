import { API, and, or, cond } from "space-api";


export default (state = {}, action) => {
  const api = new API('app-2', 'http://localhost:8092/');
  const db = api.Mongo();
  //api.setToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.EYWnKvMcrGLMP42-goodBkE8Pu7U3il65LaoJ-1Vdss')


  switch (action.type) {
    case 'ADD_DATA': {
      const sensorSetExists = state[action.obj.Id]
      if (!sensorSetExists) {
        let sensorSet= {
          [action.obj.DeviceName]: [{ Data: action.obj.Data, Date_time: action.obj.Date_time}]
        }
        let newState = Object.assign({}, state, { [action.obj.Id]: sensorSet})

       
        return newState
      }
      else {
        let tempArr = Object.assign({}, sensorSetExists);
        //-----If id as well as property exist 
        if (tempArr[action.obj.DeviceName]) {
          tempArr[action.obj.DeviceName] = tempArr[action.obj.DeviceName].reverse();
          tempArr[action.obj.DeviceName] = tempArr[action.obj.DeviceName].concat({ Data: action.obj.Data, Date_time: action.obj.Date_time }) ;
          tempArr[action.obj.DeviceName] = tempArr[action.obj.DeviceName].reverse();
          console.log(tempArr);
          return Object.assign({}, state, { [action.obj.Id]: tempArr });
        }  else {
          // ----- ID exists but propery is absent
          tempArr[action.obj.DeviceName] = [{ Data: action.obj.Data, Date_time: action.obj.Date_time }]; 
          return Object.assign({}, state, { [action.obj.Id]: tempArr });
        }
      }
    }
    default: {
      return state;
    }
  }
}

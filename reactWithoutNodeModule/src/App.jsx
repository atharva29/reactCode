import React, {Component} from 'react';
import {Router, Route} from 'react-router-dom';
import {connect} from 'react-redux';
import Dashboard from './components/Dashboard'
import {notification, Icon } from "antd";

import history from './history'
import Home from './components/Home';


import { addData, allData, storeWebsocketConnection} from './actions/actions'
import store from "./index";
class App extends Component {
 
  constructor(props) {
    super(props);
 //   this.alertBox = this.alertBox.bind(this)
  }

  // alertBox(num) {
  //   if (num < 30 && num > 27) {
  //     notification['warning']({
  //       message: 'Warning',
  //       description: 'value is close to threshold 30 °C',
  //     });
  //   } else if (num >30) {
  //     notification['error']({
  //       message: 'Error',
  //       description: 'Temp value exceeded beyond 30 °C',
  //     });
  //   }
  // }

  
  componentDidMount() {
    this.connection = new WebSocket("wss://hidden-fjord-09340.herokuapp.com/webSocket");
    console.log(this.connection)
    store.dispatch(storeWebsocketConnection(this.connection));

    this.connection.onmessage = evt => {
      var obj = JSON.parse(evt.data);
      // if(obj != undefined && obj.Data > 2 ) {
      //  this.alertBox(obj.Data)
      // }
      this.props.addData(obj);
      store.dispatch(allData(obj));
    };
  }

  render() {
    return (
      <Router history={history}>
        <div><Home /></div>
      </Router>
    );
  }
}


const mapStateToProps = state => ({
  data: state
})

const mapDispatchToProps = (dispatch) => {
  return ({
    addData: (obj) => { dispatch(addData(obj)) }
  })
}

export default connect(
  mapStateToProps, mapDispatchToProps
)(App)

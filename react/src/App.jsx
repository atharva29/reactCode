import React, {Component} from 'react';
import {Router, Route} from 'react-router-dom';
import {connect} from 'react-redux';
import Dashboard from './components/Dashboard'

import history from './history'
import Home from './components/Home';


import { addData, allData, storeWebsocketConnection} from './actions/actions'
import store from "./index";
class App extends Component {

  
  componentDidMount() {
    this.connection = new WebSocket("ws://localhost:4000/webSocket");
    console.log(this.connection)
    store.dispatch(storeWebsocketConnection(this.connection));

    this.connection.onmessage = evt => {
      var obj = JSON.parse(evt.data);
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

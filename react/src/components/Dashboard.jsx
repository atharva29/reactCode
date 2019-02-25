import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import store from '../index.js';
import { Card, Row, Col } from "antd";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.timeConverter = this.timeConverter.bind(this)
  }

   timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + '-' + month + '-' + year + '  ' + hour + ':' + min + ':' + sec;
    return time;
  }

 
  render() {
    let cards = <div>NO Data</div>;
    let map = store.getState().allMap;
    console.log(map)

    console.log("Store", store.getState());
    if (map !== undefined) {
     
      //---- value = Id  , innervalue = devicename 
     cards = Object.keys(map).map((value ) => {
        let temp = map[value]
         return Object.keys(map[value]).map((innerValue )=> {
          let dataArray = temp[innerValue];
          let address = String(value) +"-"+String(innerValue)
          

          let data = dataArray.map((val) => {
            return val.Data
          })
          data = data.reverse()
          
          let indexOfMax =  data.indexOf(Math.max.apply(null, data)) ;
          let indexOfMin =  data.indexOf(Math.min.apply(null, data));
          
          if (innerValue !== "Battery"){

            return <Col span={8}>
              <Card title={String(value) + " , " + String(innerValue)} bordered={true} style={{ width: 300, padding: 10 }} >
                <div>
                  <h1>{dataArray[0].Data}</h1>
                  <h4>Max : {Math.max.apply(null, data)},  Time : {this.timeConverter(dataArray[dataArray.length - indexOfMax - 1].Date_time)} </h4>
                  <h4>Min : {Math.min.apply(null, data)} ,  Time : {this.timeConverter(dataArray[dataArray.length - indexOfMin - 1].Date_time)}</h4>
                  <h3> <Link to={`/Analytics/${address}`}> Analytics </Link>   </h3>
                  <button onClick={(e) => {
                    this.connection = store.getState().websocketConn
                    console.log(this.connection)
                    this.connection.send(String(value) + ",RESET")
                  }}>Reset</button>

                </div>
              </Card>
            </Col>
          }
        })  
     }); 
    }
    
    return (
      <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
               <div style={{ background: "#ECECEC", margin: "30px" }}>
                  <Row gutter={16}>{cards}</Row>
               </div>
      </div>
    );
  }
}

export default Dashboard;
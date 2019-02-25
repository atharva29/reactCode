import React, { Component } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from "recharts";
import store from "../index.js";
import {Tag, Table} from "antd";

export function timeConverter(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + '-' + month + '-'/* + year */+ '  ' + hour + ':' + min + ':' + sec;
  return time;
}

function cartesian2Polar(x, y) {
  let distance = Math.sqrt(x * x + y * y)
  //radians = Math.atan2(y, x) //This takes y first
  //polarCoor = { distance: distance, radians: radians }
  return distance
}

function fourier(in_array) {
  var len = in_array.length;
   let fftArr  = []
   let temp = []
  for (var k = 0; k < len; k++) {
    var real = 0;
    var imag = 0;
    for (var n = 0; n < len; n++) {
      real += in_array[n] * Math.cos(-2 * Math.PI * k * n / len);
      imag += in_array[n] * Math.sin(-2 * Math.PI * k * n / len);
    }

    let len = temp.length + 1 ;

    fftArr.push({ x: real, y: imag });
    temp.push({ y: cartesian2Polar(real, imag),  x: 1 / (len * 0.05)  }) ;
  }
  return temp ;
}


function Stats({ match }) {
    let columns =[]
    let dataSource = [{}]

    let Id = match.params.address.split('-')[0]
    let DeviceName = match.params.address.split('-')[1]
    let allMap = store.getState().allMap
    let obj = allMap[Id]
    let chartObj = []
    let fftArray = []
    if (obj) {

      dataSource = obj[DeviceName];
      console.log(dataSource)
      for (var i = 0 ; i < dataSource.length ; i++) {
        dataSource[i].Id = Id ;   // Append Id field inside dataSource for table
        dataSource[i].DeviceName = DeviceName;  // Append DeviceName field inside dataSource for table
        chartObj.push({ x:timeConverter( dataSource[i].Date_time), y: dataSource[i].Data})
        fftArray.push(dataSource[i].Data);
        console.log(chartObj)
      }

      fftArray = fourier(fftArray).reverse();
      console.log(fftArray) ;

      columns = [
      {
        title: 'Id',
        dataIndex: 'Id',
        key: 'Id',
        render: text => <a href="javascript:;">{text}</a>,
      }, {
        title: 'Tags',
        key: 'DeviceName',
        dataIndex: 'DeviceName',
        render: DeviceName => (
          <span>
            {<Tag color="blue" >{DeviceName}</Tag>}
          </span>
        ),
      },
      {
        title: 'Data',
        dataIndex: 'Data',
        key: 'Data',
        render: text => <a href="javascript:;">{text}</a>,
      },
      {
        title: 'Date_time',
        dataIndex: 'Date_time',
        key: 'Date_time',
        render: text => <a href="javascript:;">{timeConverter(text)}</a>,
      }
    ];
  }


    return <div>
        <LineChart width={600} height={300} data={chartObj.reverse()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="x" />
          <YAxis dataKey="y" />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Line dataKey="y" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>

        <Table columns={columns} dataSource={dataSource} />
      </div>;
}

export default Stats;
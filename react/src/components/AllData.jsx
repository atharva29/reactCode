import React, { Component } from 'react';
import store from '../index.js';
import {Table ,Tag} from "antd";

class AllData extends React.Component {
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
    let items = store.getState().allData;
    console.log("Items",items)
    const columns = [
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
            {<Tag color="blue" key={DeviceName}>{DeviceName}</Tag>}
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
        render: text => <a href="javascript:;">{this.timeConverter(text)}</a>,
      }
    ];


    return (
      <div>
        <Table columns={columns} dataSource={items} />
      </div>
    );
  }
}

// const mapStateToProps = state => ({
//   data: state
// })


export default AllData;
// export default connect(
//   mapStateToProps
// )(SingleSensorStats)
import React, { Component } from 'react';
import { Layout, Menu, Icon } from "antd";
import { BrowserRouter as Router, Route, Link} from 'react-router-dom'
//-----------All Components ------------//
import Dashboard from "./Dashboard";
import AllData from "./AllData";
import Stats from "./Stats";

const { Header, Content, Footer, Sider } = Layout;

class Home extends React.Component{
  
   //---------------------Antd LayOut ------------------
  state = {
    collapsed: false
  };

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  render(){
     return <Router> 
       <div>

         <Layout style={{ minHeight: "100vh" }}>
           <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
             <div className="logo" />
             <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">

               <Menu.Item key="1">
                 <Icon type="pie-chart" />
                 <span>All Sensors</span>
                 <Link to="/" ></Link>
               </Menu.Item>

               <Menu.Item key="2">
                 <Icon type="desktop" />
                 <span>All Data</span>
                 <Link to="/allData" ></Link>
               </Menu.Item>

               <Menu.Item key="9">
                 <Icon type="file" />
                 <span>File</span>
               </Menu.Item>

             </Menu>
           </Sider>

           <Layout>
             <Header style={{ background: "#fff", padding: 0 }}>
             </Header>
             <Content style={{ margin: "0 16px" }}>
                 <div>
                   <Route path="/" exact strict component={Dashboard} />
                   <Route path="/allData" exact strict component={AllData} />
                   <Route path="/Analytics/:address" exact  component={Stats} />
                 </div>
             </Content>

             <Footer style={{ textAlign: "center" }}>
               Sharad Atharva Akash LTD. Design ©2018
           </Footer>
           </Layout>
         </Layout>;
  
       </div>
     </Router>
     
  }

}
export default Home;
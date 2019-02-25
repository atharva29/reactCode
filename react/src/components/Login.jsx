import React, { Component } from "react";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email : '' ,
      password : '' ,
      name : ''
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const data = this.state ;
    console.log("Final data ", data);
  }

  handleInputChange = (event) => {
    event.preventDefault();
    this.setState({
      [event.target.name] : event.target.value
    })
  }

  render() {
    return (
      <body>
        <input id="txtEmail1" placeholder="Email" type="text" ref="" />
        <br />
        <input id="txtPass1" placeholder="Password" type="password" />
        <br />
        <button onclick="login()">Login</button>
        <br />
        <br />

        <input id="txtEmail2" placeholder="Email" type="text" />
        <input id="txtName2" placeholder="Name" type="text" />
        <input id="txtPass2" placeholder="Password" type="password" />
        <button onclick="signUp()">Sign Up</button>
        <br />
      </body>
    );
  }
}

export default Login;
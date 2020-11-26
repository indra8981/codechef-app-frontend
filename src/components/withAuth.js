import React, { Component, useState } from "react";
import { Cookies } from "react-cookie";
import axios from "axios";
axios.defaults.baseURL = 'https://codechef-practice-backend.herokuapp.com';
export default function withAuth(ComponentToProtect) {
  return class extends Component {
    constructor() {
      super();
      this.state = {
        loading: true,
        redirect: false,
        id: "",
        username: "",
        cookieValue: "",
      };
    }

    componentDidMount() {
      const cookies = new Cookies();
      const cookieValue = cookies.get("codechefApp");
      if (cookieValue !== undefined) {
        axios.post("/checkToken", { codechefApp: cookieValue })
          .then((resp) => {
            this.setState({
              loading: false,
              id: resp.data.userId,
              username: resp.data.userName,
              cookieValue: cookieValue,
            });
          })
          .catch((err) => {
            console.error(err);
            this.setState({ loading: false, redirect: true });
          });
      } else {
        this.setState({ loading: false, redirect: true });
      }
    }

    render() {
      const { loading, redirect } = this.state;
      if (loading) {
        return null;
      }
      if (redirect) {
        return (
          <ComponentToProtect
            {...this.props}
            isLoggedIn={false}
            username=""
            cookie=""
          />
        );
      } else {
        return (
          <ComponentToProtect
            id={this.state.id}
            username={this.state.username}
            isLoggedIn={true}
            cookie={this.state.cookieValue}
            {...this.props}
          />
        );
      }
    }
  };
}
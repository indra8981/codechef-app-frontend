import React, { Component, useState } from "react";
import { Redirect } from "react-router-dom";

export default function withAuth(ComponentToProtect) {
  return class extends Component {
    constructor() {
      super();
      this.state = {
        loading: true,
        redirect: false,
        id: "",
        username: "",
      };
    }

    componentDidMount() {
      fetch("/checkToken")
        .then((response) => response.json())
        .then((resp) => {
          this.setState({
            loading: false,
            id: resp.userId,
            username: resp.userName,
          });
        })
        .catch((err) => {
          console.error(err);
          this.setState({ loading: false, redirect: true });
        });
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
          />
        );
      } else {
        return (
          <ComponentToProtect
            id={this.state.id}
            username={this.state.username}
            isLoggedIn={true}
            {...this.props}
          />
        );
      }
    }
  };
}
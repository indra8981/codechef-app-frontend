import React, { Component } from "react";
import axios from "axios";

import { Button, Form, Input, Card } from "antd";
import { Cookies } from "react-cookie";
import Navbar from "./navbar.js";
export default class LogInModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            problems: []
        };
    }

    componentDidMount() {
        axios.get("/problems")
            .then((response) => {
                console.log(response);
                this.setState({ problems: response.data });
            }).catch((error) => {
                console.log(error.response.data);
            })
    }


    render() {
        return (
            <div className="homepageContainer">
                <Navbar {...this.props} />
                {JSON.stringify(this.state.problems[0])}
            </div>
        );
    }
}
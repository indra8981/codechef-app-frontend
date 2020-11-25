import React, { Component } from "react";
import "antd/dist/antd.css";
import { PageHeader, Button, Menu, Dropdown } from "antd";
import { Cookies } from "react-cookie";
import { DownOutlined } from "@ant-design/icons";
import "./styles/navbar.css"
export default class Navbar extends Component {
    constructor() {
        super();
        this.state = {
            username: "",
            isLoggedIn: false,
        };
    }

    getDropDownMenu() {
        const menu = (
            <Menu>
                <Menu.Item
                    onClick={() => {
                        const cookies = new Cookies();
                        cookies.remove("codechefApp", { path: "/", domain: "localhost" });
                        window.location.reload();
                    }}
                >
                    <p>Logout</p>
                </Menu.Item>
            </Menu>
        );
        return menu;
    }

    async componentDidMount() {
        this.setState({ isLoggedIn: this.props.isLoggedIn, username: this.props.username });
    }

    getNav() {
        var fixedNav = [
            <Button type="primary" style={{ borderColor: "yellow", borderRadius: 10 }} key="0" onClick={() => this.props.history.push("/")}>
                HomePage
            </Button>,
            <Button key="1" type="primary" style={{ borderColor: "yellow", borderRadius: 10 }} onClick={() => this.props.history.push("/all-tags")}>
                All Tags
            </Button>,
            <Button key="2" type="primary" style={{ borderColor: "yellow", borderRadius: 10 }} onClick={() => this.props.history.push("/problems")}>
                Problems
            </Button>,
        ];
        if (this.props.isLoggedIn) {
            fixedNav = fixedNav.concat([
                <Dropdown overlay={this.getDropDownMenu()}>
                    <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                        {this.props.username} <DownOutlined />
                    </a>
                </Dropdown>,
            ]);
        } else {
            fixedNav = fixedNav.concat([
                <Button key="3" type="primary" style={{ borderColor: "yellow", borderRadius: 10 }} onClick={() => this.props.history.push("/login")}>
                    Login
                </Button>,
                <Button key="4" type="primary" style={{ borderColor: "yellow", borderRadius: 10 }} onClick={() => this.props.history.push("/register")}>
                    Signup
                </Button>,
            ]);
        }
        if (this.props.extra) {
            fixedNav = fixedNav.concat(this.props.extra);
        }
        return fixedNav;
    }
    render() {
        return (
            <div>
                <PageHeader
                    className="site-page-header"
                    onBack={() => this.props.history.goBack()}
                    title={"Programming Practice App"}
                    subTitle={this.props.subTitle}
                    extra={this.getNav()}
                    style={{ "backgroundColor": "#08979c", "color": "white" }}
                />
            </div>
        );
    }
}

Navbar.defaultProps = {
    onBack: () => { },
    title: "Programming Practice App",
    subTitle: "Home Page",
    extra: [],
    isLoggedIn: false,
};
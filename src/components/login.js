import React, { Component } from "react";
import axios from "axios";
import "./styles/login.css";
import { Button, Form, Input, Card, notification } from "antd";
import { Cookies } from "react-cookie";
import ReactTimeout from 'react-timeout'
import Navbar from "./navbar.js";
axios.defaults.baseURL = 'https://codechef-practice-backend.herokuapp.com';
class LogIn extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const layout = {
            labelCol: {
                span: 8,
            },
            wrapperCol: {
                span: 16,
            },
        };
        const tailLayout = {
            wrapperCol: {
                offset: 8,
                span: 16,
            },
        };

        const onFinish = (values) => {
            const cookiess = new Cookies();
            console.log(cookiess.get('codechefApp'));
            axios.post("/login", values)
                .then((response) => {
                    const cookies = new Cookies();
                    let expires = new Date();
                    expires.setTime(expires.getTime() + 3600000);
                    cookies.set('codechefApp', response.data, { path: '/', expires });
                    notification.success({
                        message: 'Logged in Successfully!',
                        description: "Logged in successfully Redirecting to the problems page.",
                    });
                    this.props.setTimeout(() => this.props.history.push('/problems'), 2000);

                }).catch((error) => {
                    notification.error({
                        message: 'Logged in Unsuccessful!',
                        description: "Please enter correct username and password.",
                    });
                })
        };
        if (this.props.isLoggedIn) {
            notification.error({
                message: 'Already logged in!',
                description: "Redirecting to the problems page",
            });
            this.props.setTimeout(() => this.props.history.push('/problems'), 1000);
            return null;
        }
        return (
            <div className="rootLoginContainer">
                <Navbar subTitle={"Login"} {...this.props} />
                <div className="loginContainer">

                    <Card
                        hoverable
                        style={{ width: 500 }}
                    >
                        <Form
                            {...layout}
                            name="basic"
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={onFinish}
                        >
                            <Form.Item
                                label="Username"
                                name="userName"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your username!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your password!',
                                    },
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item {...tailLayout}>
                                <Button type="primary" htmlType="submit">
                                    Login
                            </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </div>
            </div>
        );
    }
}

export default ReactTimeout(LogIn)
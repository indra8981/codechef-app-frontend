import React, { Component } from "react";
import axios from "axios";
import "./styles/login.css";
import { Button, Form, Input, Card } from "antd";
import { Cookies } from "react-cookie";
axios.defaults.baseURL = 'https://codechef-practice-backend.herokuapp.com';
export default class LogIn extends Component {
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
            axios.post("/login", values)
                .then((response) => {
                    const cookies = new Cookies();
                    let expires = new Date();
                    expires.setTime(expires.getTime() + 3600000);
                    cookies.set('codechefApp', response.data, { path: '/', expires });
                    const ref = document.referrer;
                    this.props.history.goBack();
                }).catch((error) => {
                    console.log(error.response.data);
                })
        };
        return (
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
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        );
    }
}
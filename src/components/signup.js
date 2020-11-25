import React, { Component } from "react";
import axios from "axios";
import "./styles/login.css";
import { Button, Form, Input, Card } from "antd";
import { Cookies } from "react-cookie";

export default class SignUp extends Component {
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
            axios.post("/signup", values)
                .then((response) => {

                    this.props.history.goBack();
                }).catch((error) => {
                    console.log(JSON.stringify(error));
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
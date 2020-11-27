import React, { Component } from "react";
import axios from "axios";
import "./styles/signUp.css";
import Navbar from "./navbar.js";
import { Button, Form, Input, Card, notification } from "antd";
import ReactTimeout from 'react-timeout'
import { Cookies } from "react-cookie";

class SignUp extends Component {
    constructor(props) {
        super(props);
    }
    passwordValidator(rule, value, callback) {
        if (value && value.length < 7) {
            callback("Password needs to be at least 7 characters");
            return;
        }
        callback();
    }
    usernameValidator(rule, value, callback) {
        if (value && value.length < 7) {
            callback("Username needs to be at least 7 characters");
            return;
        }
        callback();
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
                    notification.success({
                        message: 'SignUp Successful!',
                        description: "SignUp successful now redirecting to login page in 3 seconds.",
                    });
                    this.props.setTimeout(() => this.props.history.push('/login'), 3000);
                })
                .catch((error) => {
                    if (error.response) {
                        notification.error({
                            message: 'SignUp Unsuccessful!',
                            description: `${error.response.data}`,
                        });
                    }
                })
        };
        if (this.props.isLoggedIn) {
            notification.error({
                message: 'Already logged in!',
                description: "Redirecting to the problems page.",
            });
            this.props.history.push('/problems');
        }
        return (
            <div className="rootSignUpContainer">
                <Navbar subTitle={"Signup"} {...this.props} />
                <div className="signupContainer">
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
                                    { validator: this.usernameValidator },
                                ]}
                                validateTrigger='onBlur'
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
                                    { validator: this.passwordValidator },
                                ]}
                                validateTrigger='onBlur'
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item {...tailLayout}>
                                <Button type="primary" htmlType="submit">
                                    SignUp
                            </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </div>
            </div>
        );
    }
}
export default ReactTimeout(SignUp)
import React, { Component } from "react";
import axios from "axios";

import { Button, Form, Input, Card, Select, List, BackTop, notification, Drawer, Divider, Spin, Row, Tag } from "antd";
import { InfoCircleOutlined } from '@ant-design/icons';
import Navbar from "./navbar.js";
import "./styles/problems.css"
export default class Problems extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isProblemsLoading: true,
            problems: [],
            allTags: [],
            allAuthors: [],
            difficulty: ["cakewalk", "easy", "easy-medium", "medium", "medium-hard", "hard", "super-hard"],
            selectedDifficulty: undefined,
            selectedAuthor: undefined,
            selectedTags: [],
            visible: false,
            problemTags: [],
            id: "",
        };
        this.handleChangeDiff = this.handleChangeDiff.bind(this);
        this.handleChangeAuthor = this.handleChangeAuthor.bind(this);
        this.handleChangeTags = this.handleChangeTags.bind(this);
        this.getProblems = this.getProblems.bind(this);
        this.tagAdd = this.tagAdd.bind(this);
    }

    componentDidMount() {
        axios.get("https://codechef-practice-backend.herokuapp.com/problems")
            .then((response) => {
                this.setState({ isProblemsLoading: false, problems: response.data });
            }).catch((error) => {
                console.log(error.response.data);
            })
        axios.get("https://codechef-practice-backend.herokuapp.com/counts")
            .then((response) => {
                this.setState({ difficulty: response.data.difficulty, allTags: response.data.tags, allAuthors: response.data.authors }, () => {
                });
            }).catch((error) => {
                console.log(error.response.data);
            })
    }

    getProblems() {
        this.setState({ isProblemsLoading: true });
        const difficulty = this.state.selectedDifficulty == undefined ? "" : `difficulty=${this.state.selectedDifficulty}&`;
        const author = this.state.selectedAuthor == undefined ? "" : `author=${this.state.selectedAuthor}&`;
        const tags = this.state.selectedTags == [] ? "" : `tags=${this.state.selectedTags}`;
        const url = "/problems?" + difficulty + author + tags;
        axios.get(url)
            .then((response) => {
                this.setState({ isProblemsLoading: false, problems: response.data });
            }).catch((error) => {
                console.log(error.response.data);
            })
    }

    renderOptions(values) {
        const { Option } = Select;
        const children = [];
        values.forEach((option, index) => {
            children.push(<Option value={option.name} key={index}>{option.name} x {option.count}</Option>);
        });
        return children;
    }

    handleChangeDiff(values) {
        this.setState({ selectedDifficulty: values });
    }
    handleChangeAuthor(values) {
        this.setState({ selectedAuthor: values });
    }
    handleChangeTags(values) {
        this.setState({ selectedTags: values });
    }
    getDescription(item) {
        const accuracy = (item.succSubmissions / item.totSubmissions) * 100;
        const desc = `Problem Code: ${item.problemCode}, Difficulty: ${item.problemDifficulty}, Author: ${item.problemAuthor}, Successfull submissions: ${item.succSubmissions}, Total Submissions : ${item.totSubmissions}, Accuracy: ${accuracy.toFixed(2)}`;
        return desc;
    }
    onClose = () => {
        this.setState({
            visible: false,
            id: "",
            problemTags: [],
        });
    };
    getAllTags(item) {
        const url = `https://codechef-practice-backend.herokuapp.com/problemTags?problemCode=${item.problemCode}`
        axios.get(url)
            .then((response) => {
                this.setState({ visible: true, id: item.id, problemTags: response.data });
            }).catch((error) => {
                console.log(error);
            })
    }
    renderAllTags() {
        return this.state.problemTags.map((item) => {
            return this.tagRender(item);
        });
    }
    tagRender(label) {
        return (
            label.userId == 1 ? (
                <Tag color="purple" style={{ marginRight: 3, marginBottom: 3 }}>
                    {label.tagName}
                </Tag>
            ) :
                (
                    <Tag color="blue" style={{ marginRight: 3, marginBottom: 3 }}>
                        {label.tagName}
                    </Tag>
                )
        );
    }
    tagAdd(values) {
        const data = { "problemId": this.state.id, "tagName": values.tag };
        const openNotification = () => {
            notification.success({
                message: 'Tag Added Successfully',
                description: `${values.tag} is added.`,
            });
        };

        axios.post("/add-tag", data)
            .then((response) => {
                const newDt = { "tagName": values.tag, "userId": this.props.id };
                const preTags = this.state.problemTags;
                preTags.push(newDt);
                this.setState({ problemTags: preTags });
                openNotification();
            }).catch((error) => {
                console.log(error.response.data);
            })
    }

    renderAddTag() {
        return <div>
            <p className="site-description-item-profile-p" style={{ marginBottom: 24 }}>
                Add Tags
            </p>

            <div>
                <Form
                    name="basic"
                    layout="vertical"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={this.tagAdd}
                >
                    <Form.Item
                        label="Enter Tag"
                        name="tag"
                        tooltip={{
                            title: 'Enter single tags to add',
                            icon: <InfoCircleOutlined />,
                        }}
                        rules={[
                            {
                                required: true,
                                message: 'Please enter a tag to add',
                            },
                        ]}
                    >
                        <Input allowClear placeholder="Enter a tag to add" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Add Tag
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    }
    render() {
        return (
            <div className="problemPageContainer">
                <Navbar subTitle={"Problems"} {...this.props} />
                <div className="problemsContainer">
                    <Card
                        hoverable
                        style={{ width: "100%" }}>
                        <div className="searchHeaders">
                            <Select
                                showSearch
                                style={{ width: '100%', margin: 10 }}
                                placeholder="Select Difficulty"
                                onChange={this.handleChangeDiff}
                                allowClear
                            >
                                {this.renderOptions(this.state.difficulty)}
                            </Select>
                            <Select
                                showSearch
                                style={{ width: '100%', margin: 10 }}
                                placeholder="Select Author"
                                onChange={this.handleChangeAuthor}
                                allowClear
                            >
                                {this.renderOptions(this.state.allAuthors)}
                            </Select>
                            <Select
                                mode="multiple"
                                style={{ width: '100%', margin: 10 }}
                                placeholder="Select Tags"
                                onChange={this.handleChangeTags}
                                allowClear
                            >
                                {this.renderOptions(this.state.allTags)}
                            </Select>
                            <Button type="primary" onClick={this.getProblems} style={{ margin: 10 }}>Search Problems</Button>
                        </div>
                    </Card>

                    <div className="problems-list">
                        {this.state.isProblemsLoading && (
                            <div className="problemLoading">
                                <Spin tip="Loading problem list..." />
                            </div>
                        )}
                        <List
                            itemLayout="horizontal"
                            dataSource={this.state.problems}
                            renderItem={item => (
                                <List.Item
                                    actions={[<a onClick={() => { this.getAllTags(item) }} key={`a-${item.id}`}>
                                        View All Tags | Login to add Custom Tags
                                    </a>]}
                                >
                                    <List.Item.Meta
                                        title={<a href={`https://www.codechef.com/problems/${item.problemCode}`} target="_blank">{item.problemCode}</a>}
                                        description={this.getDescription(item)}
                                    />

                                </List.Item>
                            )}
                        >
                            <BackTop />
                        </List>
                        <Drawer
                            width={500}
                            placement="right"
                            closable={false}
                            onClose={this.onClose}
                            visible={this.state.visible}
                        >
                            <p className="site-description-item-profile-p" style={{ marginBottom: 24 }}>
                                All Tags
                            </p>
                            <Divider />
                            <div className="legend">
                                Legend:{" "}
                                <Tag color="purple" style={{ marginLeft: 5, marginRight: 5, marginBottom: 3 }}>
                                    Pre Defined Tags
                                </Tag>
                                {
                                    this.props.isLoggedIn && (
                                        <Tag color="blue" style={{ marginBottom: 3 }}>
                                            Custom Tags
                                        </Tag>
                                    )
                                }

                            </div>
                            <Divider />
                            <div className="tags">
                                {this.renderAllTags()}
                            </div>
                            <Divider />
                            {
                                this.props.isLoggedIn && (
                                    this.renderAddTag()
                                )
                            }
                        </Drawer>
                    </div>
                </div>
            </div>
        );
    }
}
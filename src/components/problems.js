import React, { Component } from "react";
import axios from "axios";

import { Button, Form, Input, Card, Select, List, BackTop, notification, Drawer, Divider, Spin, Row, Tag } from "antd";
import { InfoCircleOutlined } from '@ant-design/icons';
import Navbar from "./navbar.js";
import "./styles/problems.css"
axios.defaults.baseURL = 'https://codechef-practice-backend.herokuapp.com';
export default class Problems extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isProblemsLoading: true,
            problems: [],
            mytags: [],
            allTags: [],
            allAuthors: [],
            difficulty: [],
            selectedDifficulty: undefined,
            selectedAuthor: undefined,
            selectedTags: [],
            selectedPersonalTags: [],
            visible: false,
            problemTags: [],
            id: "",
        };
        this.handleChangeDiff = this.handleChangeDiff.bind(this);
        this.handleChangeAuthor = this.handleChangeAuthor.bind(this);
        this.handleChangeTags = this.handleChangeTags.bind(this);
        this.handleChangePersonalTags = this.handleChangePersonalTags.bind(this);
        this.getProblems = this.getProblems.bind(this);
        this.tagAdd = this.tagAdd.bind(this);
    }

    componentDidMount() {
        const codechefApp = this.props.cookie;
        const { difficulty, author, tags, ptags } =
            (this.props.location && this.props.location.state) || {};
        console.log(difficulty, author, tags, ptags);
        const data = this.getTagsPostData(difficulty, author, tags, ptags);
        axios.post("/problems", data)
            .then((response) => {
                this.setState({ isProblemsLoading: false, problems: response.data });
            }).catch((error) => {
                console.log(error);
            })

        console.log(data);
        axios.post("/counts", { codechefApp })
            .then((response) => {
                this.setState({ difficulty: response.data.difficulty, allTags: response.data.tags, allAuthors: response.data.authors, mytags: response.data.personal }, () => {
                });
            }).catch((error) => {
                console.log(error);
            })
    }
    getTagsPostData(difficulty, author, tags, personal) {
        const data = { codechefApp: this.props.cookie };
        if (difficulty !== undefined) {
            data["difficulty"] = difficulty;
        }
        if (author !== undefined) {
            data["author"] = author;
        }
        if (tags !== undefined) {
            data["tags"] = tags;
        }
        if (personal !== undefined) {
            data["tags"] = personal;
        }
        return data;
    }

    getProblems() {
        const codechefApp = { codechefApp: this.props.cookie };
        this.setState({ isProblemsLoading: true });
        if (this.state.selectedDifficulty !== undefined) {
            codechefApp["difficulty"] = this.state.selectedDifficulty;
        }
        if (this.state.selectedAuthor !== undefined) {
            codechefApp["author"] = this.state.selectedAuthor;
        }
        var tg = "";
        if (this.state.selectedTags.length > 0)
            tg = `${this.state.selectedTags}`;

        if (this.state.selectedPersonalTags.length > 0)
            tg += `,${this.state.selectedPersonalTags}`;
        codechefApp["tags"] = tg;
        axios.post("/problems", codechefApp)
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
    handleChangePersonalTags(values) {
        this.setState({ selectedPersonalTags: values });
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
        const codechefApp = this.props.cookie;
        const data = { problemCode: item.problemCode, codechefApp };
        axios.post("/problemTags", data)
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
        const codechefApp = this.props.cookie;
        const data = { "problemId": this.state.id, "tagName": values.tag, codechefApp };
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
                console.log(error);
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
                                defaultValue={this.state.selectedDifficulty}
                                allowClear
                            >
                                {this.renderOptions(this.state.difficulty)}
                            </Select>
                            <Select
                                showSearch
                                style={{ width: '100%', margin: 10 }}
                                placeholder="Select Author"
                                onChange={this.handleChangeAuthor}
                                defaultValue={this.state.selectedAuthor}
                                allowClear
                            >
                                {this.renderOptions(this.state.allAuthors)}
                            </Select>
                            <Select
                                mode="multiple"
                                style={{ width: '100%', margin: 10 }}
                                placeholder="Select Tags"
                                onChange={this.handleChangeTags}
                                defaultValue={this.state.selectedTags}
                                allowClear
                            >
                                {this.renderOptions(this.state.allTags)}
                            </Select>
                            {this.props.isLoggedIn && (
                                <Select
                                    mode="multiple"
                                    style={{ width: '100%', margin: 10 }}
                                    placeholder="Select Personal Tags"
                                    onChange={this.handleChangePersonalTags}
                                    defaultValue={this.state.selectedPersonalTags}
                                    allowClear
                                >
                                    {this.renderOptions(this.state.mytags)}
                                </Select>
                            )}
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
import React, { Component } from "react";
import axios from "axios";

import { Tabs, Divider, Tag } from "antd";
import { InfoCircleOutlined } from '@ant-design/icons';
import Navbar from "./navbar.js";
import "./styles/allTags.css";
axios.defaults.baseURL = 'https://codechef-practice-backend.herokuapp.com';
export default class AllTags extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mytags: [],
            allTags: [],
            allAuthors: [],
            difficulty: ["cakewalk", "easy", "easy-medium", "medium", "medium-hard", "hard", "super-hard"],
            id: "",
        };
    }

    componentDidMount() {
        const codechefApp = this.props.cookie;
        axios.post("/counts", { codechefApp })
            .then((response) => {
                this.setState({ difficulty: response.data.difficulty, allTags: response.data.tags, allAuthors: response.data.authors, mytags: response.data.personal }, () => {
                });
            }).catch((error) => {
                console.log(error.response.data);
            })
    }

    renderAllTags(tags) {
        return tags.map((item) => {
            return this.tagRender(item);
        });
    }
    tagRender(label) {
        return (
            this.state.id != "4" ? (
                <Tag color="purple" style={{ marginRight: 15, marginBottom: 15 }}>
                    {label.name} x {label.count}
                </Tag>
            ) :
                (
                    <Tag color="blue" style={{ marginRight: 15, marginBottom: 15 }}>
                        {label.name} x {label.count}
                    </Tag>
                )
        );
    }

    render() {
        const { TabPane } = Tabs;
        return (
            <div className="allTagsContainer">
                <Navbar subTitle={"All Tags"} {...this.props} />
                <div className="tabsContainer">
                    <Tabs defaultActiveKey="1" centered onChange={(key) => { this.setState({ id: key }) }}>
                        <TabPane tab="Difficulty" key="1">
                            {this.renderAllTags(this.state.difficulty)}
                        </TabPane>
                        <TabPane tab="Authors" key="2">
                            {this.renderAllTags(this.state.allAuthors)}
                        </TabPane>
                        <TabPane tab="All Other Tags" key="3">
                            {this.renderAllTags(this.state.allTags)}
                        </TabPane>
                        {this.props.isLoggedIn && (
                            <TabPane tab="Personal Tags" key="4">
                                {this.renderAllTags(this.state.mytags)}
                            </TabPane>
                        )}
                    </Tabs>
                </div>
            </div>
        );
    }
}
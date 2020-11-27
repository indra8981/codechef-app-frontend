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
            difficulty: [],
            id: "difficulty",
        };
        this.tagsClick = this.tagsClick.bind(this);
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
    tagsClick(name) {
        const params = this.state.id;
        this.props.history.push({
            pathname: '/problems',
            state: { [params]: name }
        })
    }
    tagRender(label) {
        return (
            this.state.id != "ptags" ? (
                <div className="each-tag" >
                    <Tag color="purple" style={{ marginRight: 15, marginBottom: 15 }} onClick={() => this.tagsClick(label.name)}>
                        {label.name} x {label.count}
                    </Tag>
                </div>
            ) :
                (
                    <div className="each-tag">
                        <Tag color="blue" style={{ marginRight: 15, marginBottom: 15 }} onClick={() => this.tagsClick(label.name)}>
                            {label.name} x {label.count}
                        </Tag>
                    </div>
                )
        );
    }

    render() {
        const { TabPane } = Tabs;
        console.log(this.props.isLoggedIn);
        return (
            <div className="allTagsContainer">
                <Navbar subTitle={"All Tags"} {...this.props} />
                <div className="tabsContainer">
                    <Tabs defaultActiveKey="difficulty" centered onChange={(key) => { this.setState({ id: key }) }}>
                        <TabPane tab="Difficulty" key="difficulty">
                            <div className="tb-content">
                                {this.renderAllTags(this.state.difficulty)}
                            </div>
                        </TabPane>
                        <TabPane tab="Authors" key="author">
                            <div className="tb-content">
                                {this.renderAllTags(this.state.allAuthors)}
                            </div>
                        </TabPane>
                        <TabPane tab="All Other Tags" key="tags">
                            <div className="tb-content">
                                {this.renderAllTags(this.state.allTags)}
                            </div>
                        </TabPane>
                        {this.props.isLoggedIn && (

                            <TabPane tab="Personal Tags" key="ptags">
                                <div className="tb-content">
                                    {this.renderAllTags(this.state.mytags)}
                                </div>
                            </TabPane>

                        )}
                    </Tabs>
                </div>
            </div>
        );
    }
}
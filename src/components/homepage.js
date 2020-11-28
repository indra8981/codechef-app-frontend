import React, { Component } from "react";
import axios from "axios";

import { Typography, Divider } from "antd";
import Navbar from "./navbar.js";
import "./styles/homepage.css";
import {
    CopyrightTwoTone
} from '@ant-design/icons';
const { Title, Paragraph, Text, Link } = Typography;
export default class HomePage extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div className="homepageContainer">
                <Navbar {...this.props} />
                <div className="homepageBody">
                    <Typography>
                        <Title>Problems Practice Search App</Title>
                        <Paragraph>
                            This is a programming practice web application made using Reactjs as frontend and php Slim framework as backend and MYSQL as Database.
                            
                        </Paragraph>
                        <Paragraph>
                            Main features of this web application are:
                        </Paragraph>
                        <Paragraph>
                            <ul>
                                <li>
                                    The web app supports login and signup functionality. If logged in a user can add their own tags to a problem.
                                </li>
                                <li>
                                    The web app works without login for non logged in users to just search the problems to practice according to predefined tags.
                                </li>
                                <li>
                                    <Link href="/problems">Problems</Link>  can search problems according to difficulty, authors, tags and if logged in then personal tags which were added to problems.
                                </li>
                                <li>
                                    While searching tags each tags also shows the problem counts which it is associated with along with autocomplete feature.
                                </li>
                                <li>
                                    Multiple tags can be applied at the same time while searching.
                                </li>
                                <li>
                                    <Link href="/all-tags">All tags</Link> shows a list of all tags along with their counts.
                                </li>
                                <li>
                                    Once a tag is clicked all the problems associated with that tag is shown.
                                </li>
                            </ul>
                        </Paragraph>
                        <Paragraph>
                            Gihub repo links :-
                        </Paragraph>
                        <Paragraph>
                            <ul>
                                <li>
                                    <Link target="_blank" href="https://github.com/indra8981/codechef-app-frontend">Frontend Link</Link>
                                </li>
                                <li>
                                    <Link target="_blank" href="https://github.com/indra8981/codechef-app">Backend Link</Link>
                                </li>
                            </ul>
                        </Paragraph>
                        <Paragraph>
                            <CopyrightTwoTone /> Designed by Indrajit Sinha. Codechef username <Link target="_blank" href="https://www.codechef.com/users/indrajit1">indrajit1</Link>
                        </Paragraph>
                    </Typography>
                </div>
            </div>
        );
    }
}
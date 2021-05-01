import React from 'react'
import "./styles.css";
import Impact from "./Impact";
import {BrowserRouter as Router, Route} from "react-router-dom";

export default class App extends React.Component {

    render() {
        return (
            <Router>
                <Route path="/:channel" component={Impact}/>
            </Router>
        );
    }
}

import React, {Component} from 'react';

import NavBar from '../components/NavBar.jsx';

export default class MainLayout extends Component {
  render() {
    return (
      <div>
        <NavBar/>
        <div className="container">
          {this.props.content}
        </div>
      </div>

    )
  }
}

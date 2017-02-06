'use strict';

import React from 'react';
import { Link } from 'react-router';
import ReactDOM from 'react-dom'
import _ from 'lodash'

const Layout = React.createClass ({

  render() {
    return (
      <div className="app">
        <header>
        </header>
        <div className="app">{this.props.children}</div>
        <footer>
        </footer>
      </div>
    );
  }
})

export default Layout

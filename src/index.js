import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import giraffe from './images/giraffe1.jpg'
import notGiraffe from './images/notgiraffe1.jpg'

class Image extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <img src={this.props.image}></img>
    );
  }

}

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Image image={giraffe} />
        <Image image={notGiraffe} />
      </div>
    );
  }

}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import giraffe from './images/giraffe1.jpg'
import notGiraffe from './images/notgiraffe1.jpg'

class Button extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
    <button>{this.props.name}</button>
    );
  }

}

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
        <div>
          <Image image={giraffe}/>
          <Image image={notGiraffe}/>
        </div>
        <Button name="Left"/>
        <Button name="No Giraffes"/>
        <Button name="Right"/>
      </div>
    );
  }

}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
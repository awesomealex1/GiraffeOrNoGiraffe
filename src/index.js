import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import giraffe from './images/giraffe1.jpg'
import notGiraffe from './images/notgiraffe1.jpg'

class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: 0};
  }

  changeChildCounter(reset) {
    console.log(reset);
    if (!reset) {
      this.setState((state) => ({
        count: state.count + 1
      }));
    } else {
      this.setState({
        count: 0
      });
    }
  }

  render(){
    return(
      <p>{this.state.count}</p>
    );
  }

}

class Button extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
    <button onClick={this.props.onClick}>{this.props.name}</button>
    );
  }

}

class Image extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const alt = "This is an image of either a giraffe or not a giraffe";
    return (
      <img src={this.props.image} alt={alt}></img>
    );
  }

}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.count = 0;
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.counterElement = React.createRef();
  }

  handleButtonClick(shouldBeGiraffe) {
    this.counterElement.current.changeChildCounter(!shouldBeGiraffe);
    this.changeParentCounter(!shouldBeGiraffe);
  }

  changeParentCounter(reset) {
    if (!reset) {
      this.count++;
    } else {
      this.count = 0;
    }
  }

  render() {
    return (
      <div>
        <div>
          <Image image={giraffe} isGiraffe={true}/>
          <Image image={notGiraffe} isGiraffe={false}/>
        </div>
        <div>
          <Button name="Left" onClick={() => this.handleButtonClick(true)}/>
          <Button name="No Giraffes"/>
          <Button name="Right" onClick={() => this.handleButtonClick(false)}/>
        </div>
        <Counter ref={this.counterElement}/>
      </div>
    );
  }

}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
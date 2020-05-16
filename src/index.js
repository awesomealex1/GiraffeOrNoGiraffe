import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';

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
    this.state = {
      leftImage: '',
      rightImage: '',
    };
    this.left = false; //Whether giraffe is left
    this.right = false;  //Wether giraffe is right
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.counterElement = React.createRef();
    this.giraffes = this.importAll(require.context('./images/giraffes/', false, /\.(png|jpe?g|svg)$/));
    this.notGiraffes = this.importAll(require.context('./images/notGiraffes/', false, /\.(png|jpe?g|svg)$/));
    this.updateImages = this.updateImages.bind(this);
  }

  handleButtonClick(buttonName) {

    let reset = true;

    if (this.left && buttonName === 'Left') {
      reset = false;
    } else if (this.right && buttonName === 'Right') {
      reset = false;
    } else if (!this.right && !this.left && buttonName === 'None') {
      reset = false;
    }

    this.counterElement.current.changeChildCounter(reset);
    this.changeParentCounter(reset);
    this.updateImages();
  }

  changeParentCounter(reset) {
    if (!reset) {
      this.count++;
    } else {
      this.count = 0;
    }
  }

  importAll(r) {
    return r.keys().map(r);
  }

  componentDidMount() {
    this.updateImages();
 }

  updateImages() {
    const giraffeLoc = Math.floor(Math.random() * 2);
    const giraffeIndex = Math.floor(Math.random() * this.giraffes.length);
    const notGiraffeIndex = Math.floor(Math.random() * this.notGiraffes.length);
    if (giraffeLoc === 0){
      this.left = true;
      this.right = false;
      this.setState({
        leftImage: this.giraffes[giraffeIndex],
        rightImage: this.notGiraffes[notGiraffeIndex],
      });
    } else {
      this.right = true;
      this.left = false;
      this.setState({
        rightImage: this.giraffes[giraffeIndex],
        leftImage: this.notGiraffes[notGiraffeIndex],
      });
    }
  }

  render() {
    return (
      <div>
        <div>
          <Image image={this.state.leftImage}/>
          <Image image={this.state.rightImage}/>
        </div>
        <div>
          <Button name="Left" onClick={() => this.handleButtonClick("Left")}/>
          <Button name="No Giraffes" onClick={() => this.handleButtonClick("None")}/>
          <Button name="Right" onClick={() => this.handleButtonClick("Right")}/>
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
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
      giraffe: '',
      notGiraffe: '',
      poop: 9
    };
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.counterElement = React.createRef();
    this.giraffes = this.importAll(require.context('./images/giraffes/', false, /\.(png|jpe?g|svg)$/));
    this.notGiraffes = this.importAll(require.context('./images/notGiraffes/', false, /\.(png|jpe?g|svg)$/));
    this.updateImages = this.updateImages.bind(this);
  }

  handleButtonClick(shouldBeGiraffe) {
    this.counterElement.current.changeChildCounter(!shouldBeGiraffe);
    this.changeParentCounter(!shouldBeGiraffe);
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
    let giraffeIndex = Math.floor(Math.random() * this.giraffes.length);
    let notGiraffeIndex = Math.floor(Math.random() * this.notGiraffes.length);
    this.setState({
      giraffe: this.giraffes[giraffeIndex],
      notGiraffe: this.notGiraffes[notGiraffeIndex],
    });
  }

  render() {
    return (
      <div>
        <div>
          <Image image={this.state.giraffe} isGiraffe={true}/>
          <Image image={this.state.notGiraffe} isGiraffe={false}/>
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
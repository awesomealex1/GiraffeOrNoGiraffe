import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import firebase from 'firebase';
import config from './components/Firebase/config'

class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: 0};
  }

  changeChildCounter(reset) {
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
      <p>Score: {this.state.count}</p>
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
      <img src={this.props.image} alt={alt} onClick={this.props.onClick}></img>
    );
  }

}

class App extends React.Component {
  constructor(props) {
    super(props);
    firebase.initializeApp(config);
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

  writePlayerScore(name, score) {
    firebase.database().ref('players/'+name).set(score);
  }

  logPlayerScore(name) {
    const ref = firebase.database().ref('players/'+name);
    ref.once("value").then(function(snapshot){
      console.log(name + ": " + snapshot.val());
    });
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
      this.writePlayerScore("A",this.count);
      this.logPlayerScore("A");
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
        <h1>Giraffe Or No Giraffe</h1>
        <div className="images-div">
          <Image image={this.state.leftImage} onClick={() => this.handleButtonClick("Left")}/>
          <Image image={this.state.rightImage} onClick={() => this.handleButtonClick("Right")}/>
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
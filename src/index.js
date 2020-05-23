import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import firebase from 'firebase';
import config from './components/Firebase/config'

class Username extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div className="username">
        <h2>Hello </h2><input onChange={(event) => this.props.handleChange(event.target.value)} placeholder="Enter name" maxLength="13"></input>
      </div>
    );
  }

}

class LeaderboardEntry extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div className="leaderboardEntry">
        <p>{this.props.name}: {this.props.score}</p>
      </div>
    );
  }

}

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

  render() {
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
      leaderboard: [],
      username: "Anonymous",
    };
    this.left = false; //Whether giraffe is left
    this.right = false;  //Wether giraffe is right
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.counterElement = React.createRef();
    this.giraffes = this.importAll(require.context('./images/giraffes/', false, /\.(png|jpe?g|svg)$/));
    this.notGiraffes = this.importAll(require.context('./images/notGiraffes/', false, /\.(png|jpe?g|svg)$/));
    this.updateImages = this.updateImages.bind(this);
    this.changePlayerName = this.changePlayerName.bind(this);
  }

  changePlayerName(name) {
    this.setState({
      username: name,
    });
  }

  writePlayerHighscore(name, score) {
    this.loadPlayerScores("/" + name).then(snapshot => {
      if (snapshot.val() < score) {
        firebase.database().ref('players/'+name).set(score);
      }
    }, function(error){
      console.log(error);
    })
  }

  updateLeaderboard() {
    this.loadPlayerScores().then(snapshot => {
      if (snapshot.val() != null) {
        this.updateLeaderboardState(snapshot.val());
      }
    }, function(error){
      console.log(error);
    })
  }

  loadPlayerScores(name="") {
    const ref = firebase.database().ref('players'+name);
    return ref.once("value");
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
      this.writePlayerHighscore(this.state.username,this.count);
      this.updateLeaderboard();
      this.count = 0;
    }
  }

  importAll(r) {
    return r.keys().map(r);
  }

  componentDidMount() {
    this.updateImages();
    this.updateLeaderboard();
  }

  updateLeaderboardState(leaderScores) {
    
    const names = Object.keys(leaderScores);
    const scores = Object.values(leaderScores);

    const numberOfPlayers = names.length;

    var leaderboardArray = []

    for (var i = 0; i < numberOfPlayers; i++) {
      leaderboardArray.push([names[i],scores[i]]);
    }

    this.setState({
      leaderboard: leaderboardArray,
    });
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
        <Username handleChange={this.changePlayerName}/>
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
        <div className="leaderboard">
          <h2>Leaderboard: </h2>
          {this.state.leaderboard.map((value,index) => {
            return <LeaderboardEntry name={value[0]} score={value[1]}/>
          })}
        </div>
      </div>
      
    );
  }

}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
import React, { Component } from "react";
import "./App.css";
import Navigation from "./components/Navigation/Navigation";
import SignInForm from "./components/SignInForm/SignInForm";
import RegisterForm from "./components/RegisterForm/RegisterForm";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Particles from "react-particles-js";

const particleOptions = {
  particles: {
    number: {
      value: 70,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
};


const initialState = {
  input: "",
  imageURL: "",
  box: {},
  route: "signIn",
  isSignedIn: false,
  user: {
    id: 0,
    name: "",
    email: "",
    entries: 0,
    joined: ""
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = data => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: Date(data.joined)
      }
    });
  };

  componentDidMount() {
    // fetch('http://localhost:3000/')
    //   .then(response => response.json())
    //   .then(console.log);
  }

  onInputChange = event => {
    this.setState({ input: event.target.value });
  };

  // here we only access first recognized object but we have to process all of them
  calculateFaceLocation = data => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    // Here we use pure DOM jQuery manipulation for now but i change it to React approach
    // 'passing ref'???? later on!!!!
    // const image = document.getElementById("inputImage");
    // const width = Number(image.width);
    // const height = Number(image.height);
    const width = this.faceImage.width;
    const height = this.faceImage.height;
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height
    };
  };

  saveFaceBox = box => {
    this.setState({ box });
  };

  onSubmit = () => {
    this.setState(
      (state, props) => ({ imageURL: state.input }),
      () => {
          fetch("https://murmuring-cliffs-39707.herokuapp.com/predict", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              input: this.state.imageURL
            })
          })
          .then(response => response.json())
          .then(response => {
            if (response) {
              fetch("https://murmuring-cliffs-39707.herokuapp.com/image", {
                method: "put",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  id: this.state.user.id
                })
              })
                .then(response => response.json())
                .then(count => {
                  const user = { ...this.state.user, entries: count };
                  this.setState({ user: user });
                })
                .catch(console.log);
              this.saveFaceBox(this.calculateFaceLocation(response));
            }
          })
          .catch(err => console.log(err));
      }
    );
  };

  onRouteChange = route => {
    if (route === "signIn") this.setState(initialState);
    else if (route === "home") this.setState({ isSignedIn: true });

    this.setState({ route });
  };

  render() {
    return (
      <div className="App">
        {/* <Particles className="particles" params={particleOptions} /> */}
        <Navigation
          onRouteChange={this.onRouteChange}
          isSignedIn={this.state.isSignedIn}
        />
        {this.state.route === "signIn" ? (
          <SignInForm
            onRouteChange={this.onRouteChange}
            loadUser={this.loadUser}
          />
        ) : this.state.route === "home" ? (
          <>
            <Logo />
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onSubmit={this.onSubmit}
            />
            <FaceRecognition
              imageURL={this.state.imageURL}
              box={this.state.box}
              imageRef={element => this.faceImage = element}
            />
          </>
        ) : (
          <RegisterForm
            onRouteChange={this.onRouteChange}
            loadUser={this.loadUser}
          />
        )}
      </div>
    );
  }
}

export default App;

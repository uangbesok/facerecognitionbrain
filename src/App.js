import React, { Component } from "react";
import "./App.css";
import Clarifai from "clarifai";
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

const app = new Clarifai.App({
  apiKey: "1ca0d57f5fd642e5a84c6bb4e76ea9a8"
});

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      imageURL: "",
      box: {},
      route: "signIn",
      isSignedIn: false,
    };
  }

  onInputChange = event => {
    this.setState({ input: event.target.value });
  };

  calculateFaceLocation = data => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    // Here we use pure DOM jQuery manipulation for now but i change it to React approach
    // 'passing ref'???? later on!!!!
    const image = document.getElementById("inputImage");
    const width = Number(image.width);
    const height = Number(image.height);
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
        app.models
          .predict(Clarifai.FACE_DETECT_MODEL, this.state.imageURL)
          .then(response =>
            this.saveFaceBox(this.calculateFaceLocation(response))
          )
          .catch(err => console.log(err));
      }
    );
  };

  onRouteChange = route => {
    if(route === 'signIn')
      this.setState({isSignedIn : false});
    else if(route === 'home')
      this.setState({isSignedIn : true});

    this.setState({ route });
  };

  render() {
    return (
      <div className="App">
        {/* <Particles className="particles" params={particleOptions} /> */}
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={this.state.isSignedIn}/>
        {this.state.route === "signIn" ? (
          <SignInForm onRouteChange={this.onRouteChange} />
        ) : this.state.route === "home" ? (
          <>
            <Logo />
            <Rank />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onSubmit={this.onSubmit}
            />
            <FaceRecognition
              imageURL={this.state.imageURL}
              box={this.state.box}
            />
          </>
        ) : (
          <RegisterForm onRouteChange={this.onRouteChange} />
        )}
      </div>
    );
  }
}

export default App;

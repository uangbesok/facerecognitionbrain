import React from "react";
// import "./FaceRecognition.css";

class SignInForm extends React.Component {
  constructor() {
    super();
    this.state = {
      signInEmail: "",
      signInPassword: ""
    };
  }

  onEmailChange = event => {
    this.setState({ signInEmail: event.target.value });
  };

  onPasswordChange = event => {
    this.setState({ signInPassword: event.target.value });
  };

  signInUser = async () => {
      let response = await fetch("https://murmuring-cliffs-39707.herokuapp.com/signin", 
      {
        method: 'post',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(
          {
            email : this.state.signInEmail,
            password : this.state.signInPassword,
          }
        )
      });

      let user = await response.json();
      if(user.id)
      {
        this.props.loadUser(user);
        this.props.onRouteChange("home");
      }
      else console.log('No such user!')
  }

  onSubmitSignIn = event => {
    this.signInUser()
    .catch(err => console.log(err));
  };

  render() {
    const { onRouteChange } = this.props;
    return (
      <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
        <main className="pa2 black-80">
          <section className="pt3 measure">
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f3 fw6 ph0 mh0">Sign In</legend>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="email-address">
                  Email
                </label>
                <input
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="email"
                  name="email-address"
                  id="email-address"
                  onChange={this.onEmailChange}
                />
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f6" htmlFor="password">
                  Password
                </label>
                <input
                  className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="password"
                  name="password"
                  id="password"
                  onChange={this.onPasswordChange}
                />
              </div>
              {/* <label className="pa0 ma0 lh-copy f6 pointer">
                <input type="checkbox" /> Remember me
              </label> */}
            </fieldset>
            <div className="">
              <input
                onClick={this.onSubmitSignIn}
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                type="submit"
                value="Sign in"
              />
            </div>
            <div className="lh-copy mt3">
              <p
                onClick={() => onRouteChange("register")}
                className="f6 link dim black db pointer"
              >
                Register
              </p>
              {/* <a href="#0" className="f6 link dim black db">
                Forgot your password?
              </a> */}
            </div>
          </section>
        </main>
      </article>
    );
  }
}

export default SignInForm;

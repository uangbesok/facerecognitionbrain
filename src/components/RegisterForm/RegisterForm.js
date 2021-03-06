import React from "react";
// import "./FaceRecognition.css";

class RegisterForm extends React.Component {

  constructor()
  {
    super();
    this.state = {
      registerName : '',
      registerEmail : '',
      registerPassword : '',
    }
  }

  onNameChange = event => {
    this.setState({ registerName: event.target.value });
  };

  onEmailChange = event => {
    this.setState({ registerEmail: event.target.value });
  };

  onPasswordChange = event => {
    this.setState({ registerPassword: event.target.value });
  };


  registerUser = async () => {
    let response  = await fetch("https://murmuring-cliffs-39707.herokuapp.com/register", 
    {
      method: 'post',
      headers: {'Content-Type' : 'application/json'},
      body: JSON.stringify(
        {
          name : this.state.registerName,
          email : this.state.registerEmail,
          password : this.state.registerPassword,
        }
      )
    });
    let user = await response.json();
    if(user.id)
      {
        this.props.loadUser(user);
        this.props.onRouteChange("home");
      } 
}

  onSubmitRegister = event => {
    this.registerUser()
      .catch(err => console.log(err));
  };

  render() {
    return (
      <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
        <main className="black-80">
          <section className="pa3 measure">
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f3 fw6 ph0 mh0">Register</legend>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="name">
                  Name
                </label>
                <input
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="text"
                  name="name"
                  id="name"
                  onChange = {this.onNameChange}
                />
              </div>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="email-address">
                  Email
                </label>
                <input
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="email"
                  name="email-address"
                  id="email-address"
                  onChange = {this.onEmailChange}
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
                  onChange = {this.onPasswordChange}
                />
              </div>
            </fieldset>
            <div className="lh-copy mt3">
              <input
                onClick={this.onSubmitRegister}
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                type="submit"
                value="Register"
              />
            </div>
          </section>
        </main>
      </article>
    );
  }
}

export default RegisterForm;

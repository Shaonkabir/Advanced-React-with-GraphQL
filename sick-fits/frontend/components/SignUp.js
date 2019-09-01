import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Error from "./ErrorMessage";
import Form from "./styles/Form";

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $name: String!
    $email: String!
    $password: String!
  ) {
    signup(name: $name, email: $email, password: $password) {
      id
      email
      password
    }
  }
`;

class SignUp extends Component {
  state = {
    name: "",
    email: "",
    password: ""
  };

  saveToState = e => {
    // update state
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  render() {
    return (
      <Mutation mutation={SIGNUP_MUTATION} variables={this.state}>
        {(signup, { loading, error }) => {
          return (
            <Form
              method="post"
              onSubmit={async e => {
                e.preventDefault();
                await signup();
                // after successfully registation, Clear the input fields
                this.setState({
                  name: "",
                  email: "",
                  password: ""
                });
              }}
            >
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Signup for an account !!</h2>
                <Error error={error} />
                <label htmlFor="name">
                  Name
                  <input
                    type="text"
                    placeholder="name"
                    name="name"
                    value={this.state.name}
                    onChange={this.saveToState}
                  />
                </label>
                <label htmlFor="email">
                  Email
                  <input
                    type="email"
                    placeholder="email"
                    name="email"
                    value={this.state.email}
                    onChange={this.saveToState}
                  />
                </label>
                <label htmlFor="password">
                  Password
                  <input
                    type="password"
                    placeholder="password"
                    name="password"
                    value={this.state.password}
                    onChange={this.saveToState}
                  />
                </label>
                <button type="submit">Sign up !</button>
              </fieldset>
            </Form>
          );
        }}
      </Mutation>
    );
  }
}

export default SignUp;

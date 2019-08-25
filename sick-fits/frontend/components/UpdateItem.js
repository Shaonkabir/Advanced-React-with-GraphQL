import React, { Component } from "react";
import { Mutation, Query } from "react-apollo";
import gql from "graphql-tag";
import Router from "next/router";
import Form from "./styles/Form";
import formatMoney from "../lib/formatMoney";
import ErrorMessage from "./ErrorMessage";

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
      image
    }
  }
`;

// Sending data to server using Mutation
const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $price: Int
    $image: String
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
      image: $image
    ) {
      id
      title
      description
      price
      image
    }
  }
`;

class UpdateItem extends Component {
  state = {};

  // Handle change to grab the data
  handleChange = async e => {
    const { name, type, value } = e.target;
    const val = type === "number" ? parseFloat(value) : value;

    // Update State
    this.setState({
      [name]: val
    });
  };
  // Update Item
  updateItem = async (e, updateItemMutation) => {
    e.preventDefault(); // Prevent page reloading
    const res = await updateItemMutation({
      variables: {
        id: this.props.id,
        ...this.state
      }
    });
    // after updating, Redirect to Homepage
    Router.push({
      pathname: "/"
    });
  };

  // Upload Image Files
  uploadFile = async e => {
    // grab the targeted files
    const files = e.target.files;
    // JavaScript FormData
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "sickfits");
    // connecting with Cloudinary API
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dz1ikkkiy/image/upload",
      {
        method: "POST",
        body: data
      }
    );
    // fetching data from cloudinary and convert it to JSON
    const file = await res.json();
    console.log(file);
    // Update State
    this.setState({
      image: file.secure_url,
      largeImage: file.eager[0].secure_url
    });
  };

  render() {
    return (
      <Query
        query={SINGLE_ITEM_QUERY}
        variables={{
          id: this.props.id
        }}
      >
        {({ data, loading }) => {
          if (loading) return <p>Loading...</p>;
          if (!data.item) return <p>No Item Found for ID {this.props.id}</p>;
          return (
            <Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
              {(updateItem, { loading, error }) => (
                <Form onSubmit={e => this.updateItem(e, updateItem)}>
                  <ErrorMessage error={error} />
                  <fieldset disabled={loading} aria-busy={loading}>
                    <label htmlFor="image">
                      <p>Preview Image</p>
                      <img
                        src={data.item.image}
                        alt={data.item.title}
                        width="250px"
                        height="250px"
                        display="inherit"
                      />
                      <p>Upload Image</p>
                      <input
                        type="file"
                        name="image"
                        id="image"
                        defaultValue={data.item.image}
                        required
                        onChange={this.uploadFile}
                      />
                      {this.state.image && (
                        <img
                          src={this.state.image}
                          width="250px"
                          alt="Upload Preview"
                        />
                      )}
                    </label>
                    <label htmlFor="title">
                      Title
                      <input
                        type="text"
                        placeholder="Title"
                        name="title"
                        id="title"
                        defaultValue={data.item.title}
                        required
                        onChange={this.handleChange}
                      />
                    </label>
                    <label htmlFor="price">
                      Price
                      <input
                        type="text"
                        placeholder="price"
                        name="price"
                        id="price"
                        defaultValue={data.item.price}
                        required
                        onChange={this.handleChange}
                      />
                    </label>
                    <label htmlFor="description">
                      Description
                      <textarea
                        placeholder="Enter a description"
                        name="description"
                        id="description"
                        defaultValue={data.item.description}
                        required
                        onChange={this.handleChange}
                      />
                    </label>
                    <button type="submit">Save Changes</button>
                  </fieldset>
                </Form>
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}

export default UpdateItem;
export { UPDATE_ITEM_MUTATION };

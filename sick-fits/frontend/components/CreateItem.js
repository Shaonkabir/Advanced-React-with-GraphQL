import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Router from "next/router";
import Form from "./styles/Form";
import formatMoney from "../lib/formatMoney";
import ErrorMessage from "./ErrorMessage";

// Sending data to server using Mutation
const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`;

class CreateItem extends Component {
  state = {
    title: "",
    description: "",
    image: "",
    largeImage: "",
    price: 0
  };
  // Handle change to grab the data
  handleChange = e => {
    const { name, type, value } = e.target;
    const val = type === "number" ? parseFloat(value) : value;
    this.setState({
      [name]: val
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
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
        {(createItem, { loading, error }) => (
          <Form
            onSubmit={async e => {
              // Prevent Page Re-loading
              e.preventDefault();
              // Create Mutation
              const res = await createItem();
              // Change Single Item
              console.log(res);
              Router.push({
                pathname: "/items",
                query: { id: res.data.createItem.id }
              });
            }}
          >
            <ErrorMessage error={error} />
            <fieldset disabled={loading} aria-busy={loading}>
              <label htmlFor="image">
                Upload Image
                <input
                  type="file"
                  placeholder="Upload a Image"
                  name="image"
                  id="image"
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
                  value={this.state.title}
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
                  value={this.state.price}
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
                  value={this.state.description}
                  required
                  onChange={this.handleChange}
                />
              </label>
              <button type="submit">Submit</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default CreateItem;
export { CREATE_ITEM_MUTATION };

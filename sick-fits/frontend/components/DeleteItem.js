import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { ALL_ITEMS_QUERY } from "./Items";

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;

class DeleteItem extends Component {
  // for updating items from cache using Apollo
  update = (cache, payload) => {
    // Manually update the cache on the client so it matches

    // Read the Cache for the items we want
    const data = cache.readQuery({ query: ALL_ITEMS_QUERY });
    // filter the deleted items from the page using the Id
    data.items = data.items.filter(
      item => item.id !== payload.data.deleteItem.id
    );
    // Get the actuall items Back !
    cache.writeQuery({ query: ALL_ITEMS_QUERY, data });
  };
  render() {
    return (
      <Mutation
        mutation={DELETE_ITEM_MUTATION}
        variables={{ id: this.props.id }}
        update={this.update}
      >
        {(deleteItem, { error }) => (
          <button
            onClick={() => {
              // make sure before deleting items
              if (confirm(`Are you sure to Delete this item?`)) {
                deleteItem();
              }
            }}
          >
            {this.props.children}
          </button>
        )}
      </Mutation>
    );
  }
}

export default DeleteItem;
export { DELETE_ITEM_MUTATION };

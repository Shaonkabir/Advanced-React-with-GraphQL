import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import styled from "styled-components";
import Head from "next/head";
import Error from "./ErrorMessage";

const SinlgePageStyle = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  min-height: 800px;
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  box-shadow: ${props => props.theme.bs};
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .details {
    margin: 3rem;
    font-size: 2rem;
  }
`;

const SINGLE_PAGE_QUERY = gql`
  query SINGLE_PAGE_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      largeImage
    }
  }
`;

class SingleItem extends Component {
  render() {
    return (
      <Query
        query={SINGLE_PAGE_QUERY}
        variables={{
          id: this.props.id
        }}
      >
        {({ error, loading, data }) => {
          if (error) return <Error error={error} />;
          if (!data.item) return <p>No item found for ID - {this.props.id}</p>;
          if (loading) return <p>Loading</p>;
          const item = data.item;
          console.log(data);
          return (
            <SinlgePageStyle>
              <Head>
                <title>Sick fits | {item.title}</title>
              </Head>
              <img src={item.largeImage} alt={item.title} />
              <div className="details">
                <h2>Viewing {item.title}</h2>
                <p>{item.description}</p>
              </div>
            </SinlgePageStyle>
          );
        }}
      </Query>
    );
  }
}

export default SingleItem;

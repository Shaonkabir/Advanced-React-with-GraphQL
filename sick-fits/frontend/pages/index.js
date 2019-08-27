import Head from "next/head";
import Items from "../components/Items";

const Home = props => (
  <div>
    <Head>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.2/css/all.min.css"
      />
      <link
        rel="stylesheet"
        href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
      />
    </Head>
    <Items page={parseFloat(props.query.page || 1)} />
  </div>
);
export default Home;

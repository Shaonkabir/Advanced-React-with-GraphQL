import styled from "styled-components";
import SignUp from "../components/SignUp";

const Columns = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
  grid-gap: 20px;
`;

const SignUpPage = props => (
  <Columns>
    <SignUp />
  </Columns>
);

export default SignUpPage;

import styled from "styled-components";

const TextBox = styled.input`
  background-color: #4f4f4f;
  /* border-radius: 18px; */
  height: ${props => (props.height ? props.height : "40px")};
  border: none;
  outline: none;
  font-size: 17px;
  color: white;
  padding: 5px 15px;
  box-sizing: border-box;
  width: 100%;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

export default TextBox;

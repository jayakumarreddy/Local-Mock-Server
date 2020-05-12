import styled from "styled-components";

const Button = styled.button`
  background: #03dac5;
  border: 1px solid #000000;
  box-sizing: border-box;
  box-shadow: 6px 8px 4px rgba(0, 0, 0, 0.25);
  /* border-radius: 18px; */
  text-align: center;
  cursor: pointer;
  font-weight: bold;
  outline: none;
  height: ${props => (props.height ? props.height : "40px")};
  width: ${props => (props.width ? props.width : "150px")};

  &:active {
    transform: scale(0.9);
  }
`;

export default Button;

import styled from "styled-components";
import { Button, TextField, FormControl } from "@mui/material";

export const StyledTextField = styled(TextField)`
  margin-top: 0;
  background-color: var(--background);
  height: fit-content;

  span {
    display: block;
    width: 0;
  }

  .MuiInputLabel-root,
  .MuiInputBase-input {
    font-family: var(--common-font-family), sans-serif !important;
  }

  & .MuiOutlinedInput-root {
    & fieldset {
      border: var(--gray-border);
      transition: var(--common-transition);
    }

    &:hover fieldset {
      border: var(--focus-gray-border);
    }

    &.Mui-focused fieldset {
      border: var(--focus-gray-border);
    }
  }

  @media (max-width: 991px) {
    & .MuiInputBase-input,
    .MuiInputLabel-root {
      font-size: 3vw;
    }
  }
`;

export const StyledFormControl = styled(FormControl)`
  margin-top: 0;

  .MuiSelect-select {
    height: 1.4375em;
    display: flex;
    align-items: center;
  }

  .MuiInputLabel-root,
  .MuiInputBase-input {
    font-family: var(--common-font-family), sans-serif !important;
    text-align: left;
  }

  span {
    display: block;
    width: 0;
  }

  & .MuiFilledInput-root {
    background-color: var(--background);
  }

  & .MuiOutlinedInput-root {
    & fieldset {
      border: var(--gray-border);
      transition: var(--common-transition);
    }

    &:hover fieldset {
      border: var(--focus-gray-border);
    }

    &.Mui-focused fieldset {
      border: var(--focus-gray-border);
    }
  }

  @media (max-width: 991px) {
    & .MuiInputBase-input,
    .MuiInputLabel-root {
      font-size: 3vw;
    }
  }
`;

export const StyledButton = styled(Button)`
  width: 10rem;
  padding: 0.4rem;
  border-radius: 3px;
  font-weight: bold;
  font-size: 1rem;
  color: var(--background);
  font-family: var(--common-font-family), sans-serif !important;

  &.big-width {
    width: 13rem;
    &.more {
      width: 17rem;
    }
  }

  &.delete {
    background-color: var(--danger);

    &:hover {
      background-color: var(--danger-hover);
    }
  }

  @media (max-width: 991px) {
    width: 100% !important;
    font-size: 3vw;
  }
`;

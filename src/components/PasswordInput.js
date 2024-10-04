// src/components/PasswordInput.js
import React from 'react';
import styled from 'styled-components';

const InputContainer = styled.div`
    margin: 10px 0;
`;

const Input = styled.input`
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    width: 300px;
    font-size: 1em;
    transition: border 0.3s;

    &:focus {
        border-color: #6a11cb;
        outline: none;
    }
`;

const PasswordInput = ({ password, setPassword }) => (
    <InputContainer>
        <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
        />
    </InputContainer>
);

export default PasswordInput;

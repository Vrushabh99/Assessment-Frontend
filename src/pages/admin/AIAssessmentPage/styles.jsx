import styled from "styled-components";

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

export const QuestionContainer = styled.div`
    : 16px;
    position: relative;
    &:hover div.actionsWrapper {
        display: flex;
        transition: all 0.25s ease;
    }
`;

export const GradientDivider = styled.div`
  height: 1.5px;
  background: linear-gradient(
    to right,
    transparent,
    #667eea 5%,
    #764ba2 70%,
    transparent 100%
  );
  margin: 20px 0;
`;


export const QuestionActionsWrapper = styled.div`
  display: flex;
  gap: 8px;
  padding: 4px;
  margin-left: auto;
  border: 5px solid #e3e8f0;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.9);  
  width: 100%;
  height: 100%;
  position: absolute;
  align-items: center;
  justify-content: center;
  display: none;
  z-index: 10;
`;


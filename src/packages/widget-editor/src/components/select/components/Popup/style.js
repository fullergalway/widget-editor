import styled, { css } from "styled-components";
import { ALIGN_VERTICAL } from '../../const';


export const StyledPopupContainer = styled.div`

  * {
  	box-sizing: border-box;
  }

  position: absolute;
	box-sizing: border-box;
	height: auto;
	width: 200px;
	
  z-index: 2;
  bottom: 40px;
  left: 50%;
  margin-left: -100px;
  

  ${props => props.align === ALIGN_VERTICAL && css`
    padding-left: 20px;
    left: 75px;
    bottom: initial;
    top: -30px;
    margin-left: initial;
  `}
`;

export const StyledPopupInsideContainer = styled.div`
  padding: 20px;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid rgba(26,28,34,0.1);
  border-radius: 4px;
  background-color: #FFFFFF;
  box-shadow: 0 20px 30px 0 rgba(0,0,0,0.1);

  cursor: initial;

  ${props => props.align === ALIGN_VERTICAL && css`
    box-shadow: -10px -10px 30px 0 rgba(0,0,0,0.15);
  `}

  ::-webkit-scrollbar {
    width: 7px;
  }

  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 2px grey; 
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.05);
  }
  
  ::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.3); 
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background:  rgba(0, 0, 0, 0.4); 
  }

  &:after {
    content: '';
    position: absolute;
    left: calc(50% - 5px);
    bottom: -20px;
    border: 12px solid transparent;
    border-top: 12px solid #FFFFFF;
    z-index: 3;

    ${props => props.align === ALIGN_VERTICAL && css`
      transform: rotate(90deg);
      left:0;
      top: 5px;
      bottom: initial;
    `}
  }
`;

export const StyledCategoryAlias = styled.h4`
  position: relative;
  padding-left: 20px;
  margin-bottom: 10px;
  margin-top: 0;
  color: ${props => props.active ? '#2C75B0' : '#393F44'};
  font-size: 16px;
  line-height: 25px;
  cursor: pointer;
  &:hover {
    color: #C32D7B;
  }
`;

export const StyledCategoryDescription = styled.div`
  position: relative;
  padding-left: 20px;
  margin-top: 10px;
  margin-bottom: 10px;
  color: #393F44;
  font-size: 16px;
  line-height: 25px;
`;
export const StyledValueAlias = styled.div`
  position: relative;
  padding-left: 20px;
  margin-top: 10px;
  margin-bottom: 10px;
  color: #393F44;
  font-size: 16px;
  line-height: 25px;
  min-height: 25px;
`;

export const IconBox = styled.div`
  color: #393F44;
  position: absolute;
  left: 0;
  top: 1px;
`;

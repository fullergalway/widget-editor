import React, { useState } from 'react';
import Button from 'components/button';
import { 
  StyledTabsContainer,
  StyledTabsContent,
  StyledList,
  StyledListLabel
} from './style';

const TabButton = (props) => {
  return <Button style={{ height: "100%" }} {...props} />
}

export const Tabs = ({ children }) => {
  const [active, setActive] = useState(0);
  return (
    <StyledTabsContainer>
      <StyledList>
        {children.map((child, num) => {
          const { label } = child.props;
          return label ? (
            <StyledListLabel key={num}>
              <TabButton
                onClick={() => setActive(num)} 
                active={num === active}
              >
              {label}
              </TabButton>
            </StyledListLabel>
          ) : null
        })}
      </StyledList>     
      {children.map((child, num) => {
        const { children: tabContent } = child.props;
        return (
          <StyledTabsContent 
            key={num} 
            active={num === active}
          >
            {tabContent}
          </StyledTabsContent>
        )
      })}      
    </StyledTabsContainer>
  );
}

export const Tab = ({ children }) => {
  return children;
}
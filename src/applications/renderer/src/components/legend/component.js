import React from "react";
import { utils } from '@widget-editor/core';
import { Select } from "@widget-editor/shared";
import isObjectLike from "lodash/isObjectLike";


import {
  StyledContainer,
  StyledColorsBoxContainer,
  StyledColorsBox,
  StyledColorDot,
  StyledDropdownBox,
} from "./style";

let c = 0;
const resolveSchemeColor = (scheme, index) => {
  if (index % scheme.length === 0) {
    c = 0;
  }
  const color = scheme[c];
  c++;
  return color;
};

// XXX: Move me
function resolveValue(val) {
  if (typeof val === 'string') {
    return val;
  }
  return utils.isDate(val) ? utils.parseDate(val) : val;
}

const Legend = ({
  configuration,
  schemeColor,
  selectedColor,
  activeScheme,
  columns,
  widgetData,
  patchConfiguration,
  compact,
}) => {
  const isPie = configuration.chartType === "pie";
  const isSingleColorSelection = !isPie && !isObjectLike(configuration.color);

  const handleChange = (option) => {
    const color = option.identifier === "___single_color" ? null : option;

    if (isPie) {
      patchConfiguration({ category: color });
    } else {
      patchConfiguration({ color });
    }
  };

  return (
    <StyledContainer compact={compact}>
      {isSingleColorSelection && (
        <StyledColorsBoxContainer
          overflowIsHidden={false}
          alignCenter
        >
          <StyledColorsBox alignCenter={false}>
            <StyledColorDot color={schemeColor} />
            Single color
          </StyledColorsBox>
        </StyledColorsBoxContainer>
      )}
      {!isSingleColorSelection && (
        <StyledColorsBoxContainer overflowIsHidden={true}>
          {widgetData &&
            widgetData.map((node, index) => {
              return (
                <StyledColorsBox alignCenter={true} key={`${isPie ? node.x : node.color}-${index}`}>
                  <StyledColorDot
                    color={resolveSchemeColor(activeScheme.category, index)}
                  />
                  {resolveValue(isPie ? node.x : node.color) || '−'}
                </StyledColorsBox>
              );
            })}
        </StyledColorsBoxContainer>
      )}
      <StyledDropdownBox>
        <Select
          align="horizontal"
          relative={true}
          menuPlacement="top"
          value={selectedColor}
          onChange={handleChange}
          getOptionLabel={(option) => option.alias}
          getOptionValue={(option) => option.identifier}
          options={columns}
          configuration={configuration}
          isCustom
          isPopup
        />
      </StyledDropdownBox>
    </StyledContainer>
  );
};

export default Legend;

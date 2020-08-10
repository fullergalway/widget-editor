import React, { useState, useRef, useEffect } from "react";
import { Button } from "@widget-editor/shared";

import { StyledAddSection } from "./style";

const AddSection = ({ addFilter }) => {
  return (
    <StyledAddSection>
      <Button size="small" onClick={() => addFilter()}>
        Add Filter
      </Button>
    </StyledAddSection>
  );
};
export default AddSection;

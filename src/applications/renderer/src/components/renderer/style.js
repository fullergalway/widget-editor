import styled from "styled-components";
import { DEFAULT_BORDER } from "@widget-editor/shared/lib/styles/style-constants";

export const StyledContainer = styled.div`
  position: relative;
  display: flex;
  flex-shrink: 1;
  flex-grow: 1;
  flex-flow: column;
  background: #fff;
  flex: 0 0 50%;
  width: 50%;
  ${(props) =>
    props.compact &&
    `
    flex: 0 0 100%;
    width: 100%;
    `}
  ${DEFAULT_BORDER()}
`;

export const RestoringWidget = styled.div`
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const RestoringWidgetTitle = styled.h4`
  color: #a9a9a9;
  font-size: 21px;
`;

import { redux } from "@packages/shared";

// Components
import ChartComponent from "./component";

export default redux.connectState((state) => ({
  editor: state.editor,
  widget: state.widget,
}))(ChartComponent);

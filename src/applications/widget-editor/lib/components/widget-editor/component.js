import React from "react";
import Editor from "../editor";

class WidgetEditor extends React.Component {
  render() {
    const {
      authenticated,
      application,
      onSave,
      datasetId,
      widgetId = null,
      adapter,
      theme,
      disable,
      schemes,
      compact = true
    } = this.props;

    if (typeof adapter !== "function") {
      throw new Error("Widget editor: Missing prop adapter and adapter needs to be of type Adapter");
    }

    if (!datasetId) {
      throw new Error("Widget editor: Missing prop datasetId of type string");
    }

    return React.createElement(Editor, {
      authenticated: authenticated,
      disable: disable,
      application: application,
      onSave: onSave,
      datasetId: datasetId,
      widgetId: widgetId,
      adapter: new adapter(),
      schemes: schemes,
      theme: { ...theme,
        compact: {
          isCompact: compact,
          isOpen: false
        }
      }
    });
  }

}

export default WidgetEditor;
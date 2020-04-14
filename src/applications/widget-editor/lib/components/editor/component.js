function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React from "react";
import isEqual from "lodash/isEqual";
import debounce from "lodash/debounce";
import Renderer from "@applications/renderer";
import EditorOptions from "../editor-options";
import Footer from "../footer";
import { DataService } from "@packages/core";
import { constants } from "@packages/core";
import { StyledContainer } from "./style";

class Editor extends React.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "resolveAuthentication", debounce(authenticated => {
      const {
        setEditor
      } = this.props;
      setEditor({
        authenticated
      });
    }, 1000));

    _defineProperty(this, "initializeRestoration", debounce((datasetId, widgetId) => {
      this.dataService.restoreEditor(datasetId, widgetId);
    }, 1000));

    _defineProperty(this, "resolveTheme", debounce(theme => {
      const {
        setTheme
      } = this.props;
      setTheme(theme);
    }, 1000));

    _defineProperty(this, "resolveSchemes", debounce(schemes => {
      const {
        setScheme
      } = this.props;
      setScheme(schemes);
    }, 1000));

    const {
      datasetId: _datasetId,
      widgetId: _widgetId,
      adapter,
      setEditor: _setEditor,
      dispatch,
      theme: _theme,
      schemes: _schemes
    } = this.props;
    this.onSave = this.onSave.bind(this);
    this.dataService = new DataService(_datasetId, _widgetId, adapter, _setEditor, dispatch);
    this.dataService.resolveInitialState();
    this.resolveTheme(_theme);
    this.resolveSchemes(_schemes);
    props.dispatch({
      type: constants.sagaEvents.DATA_FLOW_STORE_ADAPTER_CONFIG,
      payload: adapter
    });
  }

  componentWillMount() {
    const {
      authenticated,
      disabled
    } = this.props;

    if (authenticated) {
      this.resolveAuthentication();
    }

    this.resolveEditorFunctionality();
  }

  componentDidUpdate(prevProps) {
    const {
      datasetId: prevDatasetId,
      widgetId: prevWidgetId,
      theme: prevTheme,
      schemes: prevSchemes,
      authenticated: prevAuthenticated
    } = prevProps;
    const {
      datasetId,
      widgetId,
      theme,
      schemes,
      authenticated
    } = this.props; // When datasetId changes, we need to restore the editor itself

    if (!isEqual(datasetId, prevDatasetId) || !isEqual(widgetId, prevWidgetId)) {
      this.initializeRestoration(datasetId, widgetId);
    }

    if (!isEqual(theme, prevTheme)) {
      this.resolveTheme(theme);
    }

    if (!isEqual(schemes, prevSchemes)) {
      this.resolveSchemes(schemes);
    }

    if (!isEqual(authenticated, prevAuthenticated)) {
      this.resolveAuthentication(authenticated);
    }
  } // We debounce all properties here
  // Then we dont have to care if debouncing is set on the client


  resolveEditorFunctionality() {
    const {
      setEditor,
      disable
    } = this.props;

    if (disable && Array.isArray(disable)) {
      setEditor({
        disabledFeatures: disable
      });
    }
  }

  onSave() {
    const {
      onSave,
      dispatch,
      editorState,
      adapter,
      application
    } = this.props;

    if (typeof onSave === "function") {
      adapter.handleSave(onSave, this.dataService, application, editorState);
    }

    dispatch({
      type: constants.sagaEvents.EDITOR_SAVE
    });
  }

  render() {
    const {
      configuration,
      adapter,
      theme: {
        compact
      }
    } = this.props;
    return React.createElement(StyledContainer, compact, React.createElement(Renderer, null), configuration.limit && React.createElement(EditorOptions, {
      adapter: adapter,
      dataService: this.dataService
    }), React.createElement(Footer, {
      onSave: this.onSave
    }));
  }

}

export default Editor;
import { createSelector } from "reselect";
const SINGLE_COLOR_OPTION = {
  alias: "Single color",
  name: "Single color",
  identifier: "___single_color"
};

const getConfiguration = state => state.configuration;

const getDataset = state => state.editor.dataset;

const getFilters = state => state.filters;

const getProps = (_, props) => props ? props : null;

export const getWidgetSelectedColumn = createSelector([getConfiguration, getDataset], (configuration, dataset) => {
  if (!dataset || !dataset.id || !dataset.attributes || !dataset.attributes.metadata) {
    return null;
  }

  const value = dataset.attributes.metadata[0].attributes.columns[configuration.value.name];
  return { ...value,
    identifier: configuration.value.name
  };
});
export const getSelectedColor = createSelector([getConfiguration, getDataset, getFilters], (configuration, dataset, filters) => {
  if (!dataset || !dataset.id || !dataset.attributes || !dataset.attributes.metadata) {
    return null;
  }

  if (configuration.chartType === "pie") {
    return configuration.category || null;
  }

  return filters.color || SINGLE_COLOR_OPTION;
});
export const getWidgetColumns = createSelector([getConfiguration, getDataset, getProps], (configuration, dataset, props) => {
  if (!dataset || !dataset.id || !dataset.attributes || !dataset.attributes.widgetRelevantProps) {
    return [];
  }

  const columns = dataset.attributes.widgetRelevantProps.map(prop => ({ ...dataset.attributes.metadata[0].attributes.columns[prop],
    identifier: prop,
    name: prop
  }));

  if (configuration.chartType === "pie") {
    return columns;
  }

  if (props && props.colorDimention === true) {
    return [SINGLE_COLOR_OPTION, ...columns];
  }

  return columns;
});
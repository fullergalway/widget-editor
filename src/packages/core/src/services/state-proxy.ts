import { sagaEvents } from "../constants";
import { getAction } from "@widget-editor/shared/lib/helpers/redux";

import isEqual from "lodash/isEqual";

export default class StateProxy {
  localState: any;

  constructor() {
    this.localState = null;
  }

  update(state: any) {
    this.localState = state;
  }

  private getStateDiff(state) {
    return {
      prev: this.localState,
      next: state
    }
  }

  ShouldUpdateData(state: any) {
    const { prev, next } = this.getStateDiff(state);
    let shouldUpdate = false;

    // If limit changes, we need to fetch new data
    shouldUpdate = prev.configuration.limit !== next.configuration.limit;

    // If value, category or color changes (AXISES)
    shouldUpdate = shouldUpdate || !isEqual(prev.configuration.value, next.configuration.value);
    shouldUpdate = shouldUpdate || !isEqual(prev.configuration.category, next.configuration.category);
    shouldUpdate = shouldUpdate || !isEqual(prev.configuration.color, next.configuration.color);

    // If filters change
    shouldUpdate = shouldUpdate || !isEqual(prev.filters.list, next.filters.list);

    // If orderBy or groupBy changes
    shouldUpdate = shouldUpdate || !isEqual(prev.configuration.orderBy, next.configuration.orderBy);
    shouldUpdate = shouldUpdate || !isEqual(prev.configuration.groupBy, next.configuration.groupBy);

    return shouldUpdate;
  }

  ShouldUpdateVega(state: any) {
    const { prev, next } = this.getStateDiff(state);
    let shouldUpdate = false;

    // If theme changes
    shouldUpdate = !isEqual(prev.theme, next.theme);

    // Chart type changes
    shouldUpdate = shouldUpdate || !isEqual(prev.configuration.chartType, next.configuration.chartType);

    return shouldUpdate;
  }

}

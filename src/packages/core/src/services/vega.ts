import isObjectLike from "lodash/isObjectLike";

import { Charts, Vega } from "@packages/types";

import Pie from "../charts/pie";
import Bars from "../charts/bars";
import BarsVertical from "../charts/bars-vertical";
import Line from "../charts/line";
import Scatter from "../charts/scatter";

import { SUPPORTED_CHARTS } from "../charts/constants";

import {
  defaultVegaSchema,
  sqlFields,
} from "../helpers/wiget-helper/constants";

export default class VegaService implements Charts.Service {
  widgetConfig: any;
  widgetData: any;
  configuration: any;
  scheme: any;
  schema: Vega.Schema;
  colorApplied: boolean;

  constructor(
    widgetConfig: any,
    widgetData: any,
    configuration: any,
    theme: any
  ) {
    this.scheme = theme.schemes.find(
      (scheme) => scheme.name === theme.selectedScheme
    );

    this.colorApplied = isObjectLike(configuration.color);

    this.schema = defaultVegaSchema();
    this.widgetConfig = widgetConfig;
    this.widgetData = widgetData;
    this.configuration = configuration;

    this.setConfig();
    this.resolveChart();
  }

  groupSimilar(data) {
    const combineSimilar = {};

    data.forEach((node) => {
      if (node.x in combineSimilar) {
        combineSimilar[node.x] = {
          ...combineSimilar[node.x],
          y: combineSimilar[node.x].y + node.y,
        };
      } else {
        combineSimilar[node.x] = { ...node };
      }
    });

    const out = [];

    Object.keys(combineSimilar).forEach((node) => {
      out.push(combineSimilar[node]);
    });

    return out;
  }

  groupByTop(data, am = 5) {
    function sortHighToLow(a, b) {
      if (a.y > b.y) return -1;
      if (b.y > a.y) return 1;
      return 0;
    }

    const combine = this.groupSimilar(data);

    const sortValues = combine.sort(sortHighToLow);
    const top5 = sortValues.slice(0, am);
    const others = sortValues.slice(am, sortValues.length + 1);

    const out = [];
    let othersNode = { x: "Others", y: 0 };

    others.forEach((node) => {
      othersNode = { ...othersNode, y: othersNode.y + node.y };
    });

    top5.forEach((node) => {
      out.push({ x: node.x, y: node.y });
    });

    return [...out, othersNode];
  }

  groupByColor(data) {
    const groupColors = {};

    data.forEach((node) => {
      if (node.color) {
        if (node.color in groupColors) {
          groupColors[node.color] = {
            ...groupColors[node.color],
            y: groupColors[node.color].y + node.y,
          };
        } else {
          groupColors[node.color] = node;
        }
      }
    });

    const out = [];

    Object.keys(groupColors).forEach((node) => {
      out.push(groupColors[node]);
    });

    return out;
  }

  resolveDataFormat() {
    const { chartType, direction } = this.configuration;

    if (chartType === "pie") {
      return this.groupByTop(this.widgetData);
    }

    return this.widgetData;
  }

  resolveChart() {
    const { chartType, direction } = this.configuration;
    let chart;

    const data = this.resolveDataFormat();

    if (SUPPORTED_CHARTS.indexOf(chartType) === -1) {
      throw new Error(
        `Chart of type: ${chartType} is not supported. we support: (${SUPPORTED_CHARTS.join(
          "|"
        )})`
      );
    }

    if (chartType === "pie") {
      chart = new Pie(
        this.schema,
        this.widgetConfig,
        data,
        this.scheme,
        true
      ).getChart();
    }

    if (chartType === "bar") {
      if (direction === "horizontal") {
        chart = new Bars(
          this.schema,
          this.widgetConfig,
          data,
          this.scheme,
          this.colorApplied
        ).getChart();
      } else {
        chart = new BarsVertical(
          this.schema,
          this.widgetConfig,
          data,
          this.scheme,
          this.colorApplied
        ).getChart();
      }
    }

    if (chartType === "line") {
      chart = new Line(
        this.schema,
        this.widgetConfig,
        data,
        this.scheme,
        this.colorApplied
      ).getChart();
    }

    if (chartType === "scatter") {
      chart = new Scatter(
        this.schema,
        this.widgetConfig,
        data,
        this.scheme,
        this.colorApplied
      ).getChart();
    }

    this.schema = {
      ...this.schema,
      ...chart,
    };
  }

  setConfig() {
    this.schema = {
      ...this.schema,
      config: {
        ...this.schema.config,
        ...this.widgetConfig.config,
      },
    };
  }

  getChart() {
    return this.schema;
  }
}

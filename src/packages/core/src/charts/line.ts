import { Charts, Vega, Generic, Widget } from "@packages/types";

import { sqlFields } from "../helpers/wiget-helper/constants";

export default class Line implements Charts.Line {
  schema: Vega.Schema;
  widgetConfig: Widget.Payload;
  widgetData: Generic.ObjectPayload;

  constructor(
    schema: Vega.Schema,
    widgetConfig: Widget.Payload,
    widgetData: Generic.ObjectPayload
  ) {
    this.schema = schema;
    this.widgetConfig = widgetConfig;
    this.widgetData = widgetData;

    this.generateSchema();
    this.setGenericSettings();
  }

  generateSchema() {
    this.schema = {
      ...this.schema,
      axes: this.setAxes(),
      scales: this.setScales(),
      marks: this.setMarks(),
      data: this.bindData(),
      interaction_config: this.interactionConfig(),
      signals: [
        {
          name: "hover",
          value: null,
          on: [
            {
              events: "@cell:mouseover",
              update: "datum"
            },
            {
              events: "@cell:mouseout",
              update: "null"
            }
          ]
        }
      ]
    };
  }

  setGenericSettings() {
    this.schema = {
      ...this.schema,
      height: 400,
      autosize: {
        type: "fit",
        contains: "padding"
      },
      padding: 20
    };
  }

  interactionConfig() {
    return [
      {
        name: "tooltip",
        config: {
          fields: [
            {
              column: "y",
              property: "y",
              type: "number",
              format: ".2s"
            },
            {
              column: "x",
              property: "x",
              type: "string"
            }
          ]
        }
      }
    ];
  }

  setScales() {
    return [
      {
        name: "x",
        type: "point",
        range: "width",
        domain: { data: "table", field: "x" }
      },
      {
        name: "y",
        type: "linear",
        range: "height",
        nice: true,
        zero: true,
        domain: { data: "table", field: sqlFields.category }
      }
    ];
  }

  setMarks() {
    return [
      {
        name: "lines",
        interactive: false,
        type: "line",
        from: { data: "table" },
        encode: {
          enter: {
            x: { scale: "x", field: "x" },
            y: { scale: "y", field: "y" },
            strokeCap: { value: "round" },
            strokeWidth: { value: 2 },
            strokeJoin: { value: "round" }
          }
        }
      },
      {
        name: "points",
        interactive: false,
        type: "symbol",
        from: { data: "dots" },
        encode: {
          enter: {
            x: { scale: "x", field: "x" },
            y: { scale: "y", field: "y" }
          },
          update: {
            opacity: { value: 1 }
          }
        }
      },
      {
        name: "cell",
        type: "path",
        from: { data: "lines" },
        transform: [
          {
            type: "voronoi",
            x: "datum.x",
            y: "datum.y",
            size: [{ signal: "width" }, { signal: "height" }]
          }
        ],
        encode: {
          enter: {
            tooltip: {
              signal: "{'Value': datum.x }"
            }
          },
          update: {
            path: { field: "path" },
            fill: { value: "red" },
            opacity: { value: 0 }
          }
        }
      }
    ];
  }

  setAxes() {
    return [
      {
        ...this.schema.axis,
        ...this.schema.axisX,
        orient: "bottom",
        scale: "x",
        labelOverlap: "parity",
        ticks: false
      },
      {
        ...this.schema.axis,
        ...this.schema.axisY,
        orient: "left",
        scale: "y",
        labelOverlap: "parity",
        format: "s",
        encode: {
          labels: {
            update: {
              align: { value: "right" },
              baseline: { value: "bottom" }
            }
          }
        }
      }
    ];
  }

  bindData(): Vega.Data[] {
    const { widgetData } = this;
    return [
      {
        values: widgetData,
        name: "table",
        transform: [
          { type: "identifier", as: "id" },
          { type: "joinaggregate", as: ["count"] }
        ]
      },
      {
        name: "dots",
        source: "table",
        transform: [
          {
            type: "filter",
            expr: "hover && hover.datum.x === datum.x"
          }
        ]
      }
    ];
  }

  getChart() {
    return this.schema;
  }
}

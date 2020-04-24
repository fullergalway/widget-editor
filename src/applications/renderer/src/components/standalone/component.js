import React, { Fragment, Suspense } from "react";

import useWidgetData from "./fetch-data-hook";
import useLayerData from "./fetch-layers-hook";

const Chart = React.lazy(() => import("../chart"));
const Map = React.lazy(() => import("@widget-editor/map"));

const Standalone = ({ thumbnail, widgetConfig, adapter, theme }) => {
  const isMap = widgetConfig.type === "map";

  const [{ data, isLoading, isError }] = useWidgetData(
    widgetConfig,
    theme,
    isMap
  );

  const [{ layerData, isLoadingLayers, isErrorLayers }] = useLayerData(
    widgetConfig?.layer_id,
    isMap
  );

  if (isLoading || isLoadingLayers) {
    return "Loading...";
  }

  if (isError || isErrorLayers) {
    return "Error loading widget...";
  }

  return (
    <Fragment>
      {!isMap && (
        <Suspense>
          <Chart
            thumbnail={thumbnail}
            standalone
            standaloneConfiguration={data}
          />
        </Suspense>
      )}
      {isMap && (
        <Suspense>
          <Map
            widget={{
              attributes: {
                widgetConfig,
              },
            }}
            mapConfiguration={{
              lat: widgetConfig.lat || 0,
              lng: widgetConfig.lng || 0,
              bbox: widgetConfig.bbox || 0,
              zoom: widgetConfig.zoom || 2,
            }}
            caption={widgetConfig?.paramsConfig?.caption || null}
            layers={[layerData]}
          />
        </Suspense>
      )}
    </Fragment>
  );
};

export default Standalone;

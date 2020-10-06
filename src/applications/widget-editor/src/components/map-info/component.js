import React, { useEffect } from "react";

import Select from "react-select";

import { BASEMAPS, LABELS, BOUNDARIES } from '@widget-editor/map/lib/constants';

import FlexContainer from "styles-common/flex";
import FormLabel from "styles-common/form-label";
import InputGroup from "styles-common/input-group";
import Input from "styles-common/input";

import BasemapSelection from "./basemaps";
import LabelSelection from "./labels";
import BoundariesSelection from "./boundaries";

const InputStyles = {
  control: () => ({
    // none of react-select's styles are passed to <Control />
    display: "flex",
    border: "1px solid rgba(202,204,208,0.85)",
    borderRadius: "4px",
    background: "#FFF",
    padding: "3px 0",
  }),
  option: (base) => ({
    ...base,
  }),
};

const generateOptions = (layers) => {
  if (!layers) {
    return [];
  }
  return layers.map((l) => ({
    label: l.attributes.name,
    value: l.id,
  }));
};

const MapInfo = ({ editor, configuration, patchConfiguration, editorSyncMap }) => {
  const { layers = null } = editor;
  const options = generateOptions(layers);
  const selectedOption = options.find((o) => o.value === configuration.layer);

  useEffect(() => {
    if (!selectedOption && options.length > 0) {
      patchConfiguration({
        layer: options[0].value
      });
    }
  }, [selectedOption, options, patchConfiguration])


  const handleChange = (option) => {
    patchConfiguration({
      layer: option.value,
    });
  };

  const setBasemap = (basemap) => {
    const patch = {
      ...configuration.map,
      basemap: {
          ...configuration.map.basemap,
          basemap
      }
    }
    editorSyncMap(patch)
    patchConfiguration({
      map: patch
    });
  };

  const setLabels = (label) => {
    const patch = {
      ...configuration.map,
      basemap: {
        ...configuration.map.basemap,
       labels: label
      }
    }
    editorSyncMap(patch)
    patchConfiguration({
      map: patch
    });
  }

  const setBoundaries = (active) => {
    const patch = {
      ...configuration.map,
      basemap: {
          ...configuration.map.basemap,
          boundaries: active
      }
    };
    editorSyncMap(patch)
    patchConfiguration({
      map: patch
    });
  }

  return (
    <FlexContainer>
      <InputGroup>
        <FormLabel htmlFor="options-title">Layers</FormLabel>
        <Select
          onChange={(option) => handleChange(option)}
          value={selectedOption}
          options={options}
          styles={InputStyles}
        />
      </InputGroup>
      <InputGroup>
        <FormLabel htmlFor="options-basemap">Basemap</FormLabel>
        <BasemapSelection
          configuration={configuration}
          basemaps={BASEMAPS}
          onSetBasemap={(basemap) => setBasemap(basemap)}
        />
      </InputGroup>
      <InputGroup>
        <FormLabel htmlFor="options-labels">Labels</FormLabel>
        <LabelSelection
          configuration={configuration}
          labels={LABELS}
          onSetLabel={(label) => setLabels(label)}
        />
      </InputGroup>
      <InputGroup>
        <FormLabel htmlFor="options-boundaries">Boundaries</FormLabel>
        <BoundariesSelection
          configuration={configuration}
          boundaries={BOUNDARIES}
          onSetBoundry={(active) => setBoundaries(active)}
        />
      </InputGroup>
    </FlexContainer>
  );
};

export default MapInfo;

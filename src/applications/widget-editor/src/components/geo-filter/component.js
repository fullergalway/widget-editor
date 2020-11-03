import React, { useState, useMemo, useCallback, useEffect } from "react";
import PropTypes from "prop-types";

import { Select } from "@widget-editor/shared";

const GeoFilter = ({ dataService, areaIntersection, setFilters, patchConfiguration }) => {
  const [predefinedAreasOptions, setPredefinedAreasOptions] = useState([]);
  const [userAreasOptions, setUserAreasOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  const options = useMemo(() => [
    {
      label: 'Custom areas',
      options: userAreasOptions,
    },
    {
      label: 'Predefined areas',
      options: predefinedAreasOptions,
    },
  ], [predefinedAreasOptions, userAreasOptions]);

  const onChangeArea = useCallback((option) => {
    setFilters({ areaIntersection: option?.value ?? null });
    patchConfiguration();
  }, [patchConfiguration, setFilters]);

  useEffect(() => {
    const fetchAreas = async () => {
      const options = (await dataService.getPredefinedAreas())
        .map(({ id, name }) => ({
          label: name,
          value: id,
        }));

      setPredefinedAreasOptions(options);
    };

    const fetchUserAreas = async () => {
      const options = (await dataService.getUserAreas())
        .map(({ id, name }) => ({
          label: name,
          value: id,
        }));

        setUserAreasOptions(options);
    };

    fetchAreas();
    fetchUserAreas();
  }, [dataService, setPredefinedAreasOptions, setUserAreasOptions]);

  useEffect(() => {
    if (!areaIntersection) {
      setSelectedOption(null);
    } else {
      const option = [
        ...predefinedAreasOptions,
        ...userAreasOptions,
      ].find(option => option.value === areaIntersection);
      setSelectedOption(option);
    }
  }, [areaIntersection, predefinedAreasOptions, userAreasOptions, setSelectedOption]);
  
  return (
    <Select
      id="geo-filter"
      name="geo-filter"
      aria-label="Select an area"
      placeholder="Select an area"
      value={selectedOption}
      options={options}
      onChange={onChangeArea}
      isClearable
    />
  );
};

GeoFilter.propTypes = {
  dataService: PropTypes.object.isRequired,
  areaIntersection: PropTypes.string,
  setFilters: PropTypes.func.isRequired,
  patchConfiguration: PropTypes.func.isRequired,
};

GeoFilter.defaultProps = {
  areaIntersection: null,
};

export default GeoFilter;

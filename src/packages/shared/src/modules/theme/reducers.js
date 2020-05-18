import * as actions from "./actions";

export default {
  [actions.setTheme]: (state, { payload }) => {
    return { ...state, ...payload };
  },
  [actions.setScheme]: (state, { payload }) => {
    let selectedScheme = payload.find(
      (scheme) => scheme.name === state.selectedScheme
    );

    if (!selectedScheme) {
      selectedScheme = payload[0].name;
    } else {
      selectedScheme = selectedScheme.name;
    }

    return {
      ...state,
      selectedScheme,
      schemes: payload,
    };
  },
};

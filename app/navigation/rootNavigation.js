import React from "react";

export const navigationRef = React.createRef();

const navigate = (name, params) => {
  navigationRef.current?.navigate(name, params);
};

const dispatch = (dispatchParams) =>
  navigationRef.current?.dispatch(dispatchParams);

const getRootState = () => {
  return navigationRef.current?.getRootState();
};

const resetRoot = (resetParams) => {
  navigationRef.current?.resetRoot({
    ...navigationRef.current?.getRootState(),
    ...resetParams,
  });
};

export default {
  navigate,
  dispatch,
  resetRoot,
  getRootState,
};

import type { ComponentProps } from "react";

import "../css/Loading.css"

const Loading = () => {
  return (
    <div className="l-loading">
      <LoadingFootPrint />
    </div>
  );
};

const LoadingFootPrint = () => {
  return <div className="c-loading--footprint"></div>;
};

const LoadingContinuousSquare = () => {
  return <div className="c-loading--continuousSquare" />;
};

const LoadingSpinner = () => {
  return <div className="c-loading--spinner"></div>;
};

const LoadingDots = () => {
  return <div className="c-loading--dots"></div>;
};

const LoadingFactory = ({ style }: ComponentProps<"div">) => {
  return <div className="l-loading--factory" style={style} />;
};

export {
  Loading,
  LoadingFootPrint,
  LoadingContinuousSquare,
  LoadingSpinner,
  LoadingDots,
  LoadingFactory,
};

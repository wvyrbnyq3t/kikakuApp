import { useOutletContext } from "react-router-dom";
import type { LiveEventContextType } from "../../../pages/Live/LiveEvent";

const useLiveEventContext = () => {
  return useOutletContext<LiveEventContextType>();
};

export { useLiveEventContext };

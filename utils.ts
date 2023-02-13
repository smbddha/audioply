import { RefObject } from "react";
import { ConnNode, Point } from "@/types";

export const getRefCoords = (ref: RefObject<HTMLElement>): Point | null => {
  if (!ref) return null;
  if (!ref.current) return null;
  const rect = ref.current.getBoundingClientRect();

  return { x: rect.x, y: rect.y };
};

const CONNECTION_X_OFFSET = 16;
const CONNECTION_Y_OFFSET = 9;
export const getCoords = (connNode: ConnNode): Point | null => {
  const [node, outputOrInput, idx] = connNode;

  let ref;
  if (outputOrInput === "input") {
    ref = node.inputRefs[idx];
  } else if (outputOrInput === "output") {
    ref = node.outputRefs[idx];
  }

  if (!ref) return null;

  const p = getRefCoords(ref);
  if (!p) return null;

  return {
    x: p.x + (outputOrInput === "input" ? 4 : CONNECTION_X_OFFSET),
    y: p.y + CONNECTION_Y_OFFSET,
  };
};

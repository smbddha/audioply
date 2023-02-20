import { create } from "zustand";
import produce from "immer";
import { ConnNode, INode } from "./types";

interface IStore {
  nodes: INode[];
  connections: [ConnNode, ConnNode][];
  addNode: (a: INode) => void;
  deleteNode: (a: INode) => void;
  updateNode: (a: INode) => void;
  makeConnection: (a: [ConnNode, ConnNode]) => void;
  deleteConnection: (idx: number) => void;
}

export const useStore = create((set, get) => ({
  // TODO start with audio destination node
  nodes: [],
  connections: [],
  addNode: (payload: INode) => {
    set(
      produce((draft) => {
        draft.nodes.push(payload);
      })
    );
  },
  deleteNode: (payload: INode) => {
    set(
      produce((draft) => {
        delete draft[payload.id];
      })
    );
  },
  updateNode: (payload: INode) => {},
  makeConnection: (payload) => {
    set(produce((draft) => {}));
  },
  deleteConnection: (payload) => {
    set(produce((draft) => {}));
  },
}));

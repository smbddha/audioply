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

export const useStore = create<IStore>((set, get) => ({
  // TODO start with audio destination node
  nodes: [],
  connections: [],
  addNode: (payload: INode) => {
    set(
      (state) => ({
        ...state,
        nodes: [...state.nodes, payload],
      })
      // produce((draft) => {
      //   draft.nodes.push(payload);
      // })
    );
  },
  deleteNode: (payload: INode) => {
    set(
      (state) => ({
        ...state,
        nodes: [...state.nodes, payload],
      })
      // produce((draft) => {
      //   console.log(draft, payload);
      //   payload.node.disconnect();
      //   let idx = draft.nodes.findIndex((el: INode) => el.id === payload.id);
      //   draft.nodes.splice(idx, 1);
      // })
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

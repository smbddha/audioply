import { create } from "zustand";
// import produce from "immer";
// import { immer } from "zustand/middleware/immer";
import { ConnNode, INode } from "./types";

interface IStore {
  context: AudioContext | null;
  nodes: INode[];
  connections: [ConnNode, ConnNode][];
  addNode: (a: INode) => void;
  reset: () => void;
  deleteNode: (a: INode) => void;
  addConnections: (...a: [ConnNode, ConnNode][]) => void;
  deleteConnection: (idx: number) => void;
  filterConnections: (a: (b: [ConnNode, ConnNode]) => boolean) => void;
  removeConnectionsWithNode: (a: INode) => void;
  remakeConnectionsWithNode: (a: INode) => void;
}

export const useStore = create<IStore>((set, get) => ({
  // TODO start with audio destination node

  // dont initialize unless in the browser
  context: typeof window !== "undefined" ? new AudioContext() : null,
  nodes: [],
  connections: [],
  addNode: (payload: INode) => {
    set((state) => ({
      ...state,
      nodes: [...state.nodes, payload],
    }));
  },
  reset: () => {
    get().filterConnections(() => false);
    set((state) => ({
      ...state,
      nodes: [],
      connections: [],
    }));
  },
  deleteNode: (payload: INode) => {
    set((state) => {
      let idx = state.nodes.findIndex((el) => el.id === payload.id);

      return {
        ...state,
        nodes: [...state.nodes.slice(0, idx), ...state.nodes.slice(idx + 1)],
      };
    });
    get().removeConnectionsWithNode(payload);
  },
  addConnections: (...newConnections: [ConnNode, ConnNode][]) => {
    set((state) => {
      newConnections.map(([start, end]) => {
        const [startNode, startNodeType, _a] = start;
        const [endNode, endNodeType, _b] = end;

        if (startNodeType === endNodeType) return false;

        if (startNodeType === "output") {
          startNode.audioNode.connect(endNode.audioNode);
        } else {
          endNode.audioNode.connect(startNode.audioNode);
        }
      });
      return {
        ...state,
        connections: [...state.connections, ...newConnections],
      };
    });
  },
  removeConnectionsWithNode: (node: INode) => {
    get().filterConnections(
      ([start, end]) => !(start[0].id === node.id || end[0].id === node.id)
    );
  },
  remakeConnectionsWithNode: (node: INode) => {
    set((state) => {
      state.connections.map(([start, end]) => {
        if (!(start[0].id === node.id || end[0].id === node.id)) return;

        const [startNode, startNodeType, _a] = start;
        const [endNode, _b, _c] = end;

        if (startNodeType === "output") {
          startNode.audioNode.connect(endNode.audioNode);
        } else {
          endNode.audioNode.connect(startNode.audioNode);
        }
      });
      return {
        ...state,
      };
    });
  },
  filterConnections: (pred: (a: [ConnNode, ConnNode]) => boolean) => {
    set((state) => {
      state.connections.map(([start, end]) => {
        if (pred([start, end])) return;

        const [startNode, startNodeType, _a] = start;
        const [endNode, _b, _c] = end;

        if (startNodeType === "output") {
          startNode.audioNode.disconnect(endNode.audioNode);
        } else {
          endNode.audioNode.disconnect(startNode.audioNode);
        }
      });
      return {
        ...state,
        connections: state.connections.filter(pred),
      };
    });
  },
  deleteConnection: (connIdx: number) => {
    set((state) => {
      const [start, end] = state.connections[connIdx];

      const [startNode, startNodeType, _a] = start;
      const [endNode, _b, _c] = end;

      if (startNodeType === "output") {
        startNode.audioNode.disconnect(endNode.audioNode);
      } else {
        endNode.audioNode.disconnect(startNode.audioNode);
      }
      return {
        ...state,
        connections: [
          ...state.connections.slice(0, connIdx),
          ...state.connections.slice(connIdx + 1),
        ],
      };
    });
  },
}));

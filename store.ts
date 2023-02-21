import { setAutoFreeze } from "immer";
import { create } from "zustand";
// import produce from "immer";
import { immer } from "zustand/middleware/immer";
import { ConnNode, INode } from "./types";

interface IStore {
  context: AudioContext | null;
  nodes: INode<AudioNode>[];
  connections: [ConnNode, ConnNode][];
  addNode: (a: INode<AudioNode>) => void;
  deleteNode: (a: INode<AudioNode>) => void;
  updateNode: (a: Partial<INode>) => void;
  addConnections: (...a: [ConnNode, ConnNode][]) => void;
  deleteConnection: (idx: number) => void;
  filterConnections: (a: (b: [ConnNode, ConnNode]) => boolean) => void;
  removeConnectionsWithNode: (a: INode<AudioNode>) => void;
  remakeConnectionsWithNode: (a: INode<AudioNode>) => void;
}

// failed immer test
// setAutoFreeze(false);
// export const useStore = create(
//   immer<IStore>((set, get) => ({
//     // TODO start with audio destination node
//     nodes: [],
//     connections: [],
//     addNode: (payload: INode) =>
//       set(
//         // (state) => ({
//         //   ...state,
//         //   nodes: [...state.nodes, payload],
//         // })
//         (state) => {
//           state.nodes.push(payload);
//         }
//       ),
//     deleteNode: (payload: INode) => {
//       set(
//         // (state) => {
//         //   let idx = state.nodes.findIndex((el: INode) => el.id === payload.id);
//         //   return {
//         //     ...state,
//         //     nodes: [
//         //       ...state.nodes.slice(0, idx),
//         //       ...state.nodes.slice(idx + 1),
//         //     ],
//         //   };
//         // }
//         (state) => {
//           console.log(state, payload);
//           payload.node.disconnect();
//           let idx = state.nodes.findIndex((el: INode) => el.id === payload.id);
//           state.nodes.splice(idx, 1);
//         }
//       );
//     },
//     updateNode: (payload: INode) => {},
//     makeConnection: (payload) => {
//       set((state) => {});
//     },
//     deleteConnection: (payload) => {
//       set((state) => {});
//     },
//   }))
// );

export const useStore = create<IStore>((set, get) => ({
  // TODO start with audio destination node

  // dont initialize unless in the browser
  context: typeof window !== "undefined" ? new AudioContext() : null,
  nodes: [],
  connections: [],
  addNode: (payload: INode<AudioNode>) => {
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
  deleteNode: (payload: INode<AudioNode>) => {
    set(
      (state) => {
        let idx = state.nodes.findIndex((el) => el.id === payload.id);

        console.log(payload);

        return {
          ...state,
          // connections: state.connections.filter(
          //   ([start, end]) =>
          //     !(start[0].id === payload.id || end[0].id === payload.id)
          // ),
          nodes: [...state.nodes.slice(0, idx), ...state.nodes.slice(idx + 1)],
        };
      }
      // produce((draft) => {
      //   console.log(draft, payload);
      //   payload.node.disconnect();
      //   let idx = draft.nodes.findIndex((el: INode) => el.id === payload.id);
      //   draft.nodes.splice(idx, 1);
      // })
    );
    // get().filterConnections(
    //   ([start, end]) =>
    //     !(start[0].id === payload.id || end[0].id === payload.id)
    // );
    get().removeConnectionsWithNode(payload);
  },
  updateNode: (payload: Partial<INode>) => {
    set((state) => {
      return {
        ...state,
        nodes: kj,
      };
    });
  },
  addConnections: (...newConnections: [ConnNode, ConnNode][]) => {
    set((state) => {
      newConnections.map(([start, end]) => {
        const [startNode, startNodeType, _a] = start;
        const [endNode, endNodeType, _b] = end;

        if (startNodeType === endNodeType) return false;

        console.log(startNode, endNode);
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
  removeConnectionsWithNode: (node: INode<AudioNode>) => {
    get().filterConnections(
      ([start, end]) => !(start[0].id === node.id || end[0].id === node.id)
    );
  },
  remakeConnectionsWithNode: (node: INode<AudioNode>) => {
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
    console.log("FILTERING");
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

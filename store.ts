import { setAutoFreeze } from "immer";
import { create } from "zustand";
// import produce from "immer";
import { immer } from "zustand/middleware/immer";
import { ConnNode, INode } from "./types";

interface IStore {
  nodes: INode[];
  connections: [ConnNode, ConnNode][];
  addNode: (a: INode) => void;
  deleteNode: (a: INode) => void;
  updateNode: (a: Partial<INode>) => void;
  addConnections: (...a: [ConnNode, ConnNode][]) => void;
  deleteConnection: (idx: number) => void;
  filterConnections: (a: (b: [ConnNode, ConnNode]) => boolean) => void;
  removeConnectionsWithNode: (a: INode) => void;
}

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
      (state) => {
        let idx = state.nodes.findIndex((el: INode) => el.id === payload.id);

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

        if (startNodeType === "output") {
          startNode.node.connect(endNode.node);
        } else {
          endNode.node.connect(startNode.node);
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
  filterConnections: (pred: (a: [ConnNode, ConnNode]) => boolean) => {
    console.log("FILTERING");
    set((state) => {
      state.connections.map(([start, end]) => {
        if (pred([start, end])) return;

        const [startNode, startNodeType, _a] = start;
        const [endNode, _b, _c] = end;

        if (startNodeType === "output") {
          startNode.node.disconnect(endNode.node);
        } else {
          endNode.node.disconnect(startNode.node);
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
        startNode.node.disconnect(endNode.node);
      } else {
        endNode.node.disconnect(startNode.node);
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

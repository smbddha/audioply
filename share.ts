import { AudioNodeType, ConnNode, INode } from "@/types";
import { nodeOptions, createNode } from "@/utils";

// Which params each node type exposes. `audioParams` are read/written via
// `node[key].value`; `props` are plain enum/boolean fields. Anything not
// listed here (loaded buffers, IRs, waveshaper curves, live mic) can't be
// serialized and is recreated with defaults on load.
type ParamSpec = { audioParams?: string[]; props?: string[] };

const PARAM_SPECS: Partial<Record<AudioNodeType, ParamSpec>> = {
  [AudioNodeType.Oscillator]: {
    audioParams: ["frequency", "detune"],
    props: ["type"],
  },
  [AudioNodeType.Gain]: { audioParams: ["gain"] },
  [AudioNodeType.Biquad]: {
    audioParams: ["frequency", "detune", "Q", "gain"],
    props: ["type"],
  },
  [AudioNodeType.Delay]: { audioParams: ["delayTime"] },
  [AudioNodeType.Compressor]: {
    audioParams: ["threshold", "knee", "ratio", "attack", "release"],
  },
  [AudioNodeType.Convolver]: { props: ["normalize"] },
  [AudioNodeType.AudioBuffer]: { audioParams: ["detune"] },
  [AudioNodeType.Panner]: {
    audioParams: ["positionX", "positionY", "positionZ"],
    props: ["panningModel"],
  },
};

type ParamValues = Record<string, number | string | boolean>;

type SerializedNode = {
  id: string;
  type: AudioNodeType;
  position?: { x: number; y: number };
  params?: ParamValues;
};

type SerializedConn = { out: [string, number]; in: [string, number] };

export type SerializedGraph = {
  v: 1;
  nodes: SerializedNode[];
  connections: SerializedConn[];
};

const serializeParams = (node: INode): ParamValues => {
  const spec = PARAM_SPECS[node.type];
  if (!spec) return {};
  const an = node.audioNode as unknown as Record<string, any>;
  const out: ParamValues = {};
  spec.audioParams?.forEach((k) => {
    if (an[k]) out[k] = an[k].value;
  });
  spec.props?.forEach((k) => {
    out[k] = an[k];
  });
  return out;
};

const applyParams = (
  audioNode: AudioNode,
  type: AudioNodeType,
  params: ParamValues
) => {
  const spec = PARAM_SPECS[type];
  if (!spec) return;
  const an = audioNode as unknown as Record<string, any>;
  spec.audioParams?.forEach((k) => {
    if (k in params && an[k]) an[k].value = params[k];
  });
  spec.props?.forEach((k) => {
    if (k in params) an[k] = params[k];
  });
};

export const serializeGraph = (
  nodes: INode[],
  connections: [ConnNode, ConnNode][]
): SerializedGraph => ({
  v: 1,
  nodes: nodes.map((n) => ({
    id: n.id,
    type: n.type,
    position: n.position,
    params: serializeParams(n),
  })),
  connections: connections.map(([a, b]) => {
    // A connection stores its two ends in arbitrary order; normalize to
    // output -> input so it's unambiguous to rebuild.
    const [outSide, inSide] = a[1] === "output" ? [a, b] : [b, a];
    return {
      out: [outSide[0].id, outSide[2]],
      in: [inSide[0].id, inSide[2]],
    };
  }),
});

const factoryForType = (type: AudioNodeType) =>
  Object.values(nodeOptions).find((o) => o.nodeType === type);

// Rebuild live INodes + connection tuples from a serialized graph. Nodes keep
// their original ids so connections resolve.
export const buildGraph = (
  ctx: AudioContext,
  g: SerializedGraph
): { nodes: INode[]; connections: [ConnNode, ConnNode][] } => {
  const byId = new Map<string, INode>();
  const nodes = g.nodes
    .map((sn, i) => {
      const opt = factoryForType(sn.type);
      if (!opt) return null;
      const node = createNode(ctx, opt);
      node.id = sn.id;
      // Fan out nodes that never got a saved position so they don't pile up.
      node.position = sn.position ?? { x: 40 * i, y: 40 * i };
      if (sn.params) applyParams(node.audioNode, sn.type, sn.params);
      byId.set(node.id, node);
      return node;
    })
    .filter((n): n is INode => n !== null);

  const connections: [ConnNode, ConnNode][] = [];
  g.connections.forEach((c) => {
    const outNode = byId.get(c.out[0]);
    const inNode = byId.get(c.in[0]);
    if (!outNode || !inNode) return;
    connections.push([
      [outNode, "output", c.out[1]],
      [inNode, "input", c.in[1]],
    ]);
  });

  return { nodes, connections };
};

const HASH_KEY = "g";

// URL-safe base64 (base64url) so the payload needs no extra escaping in the
// location hash.
const encode = (g: SerializedGraph): string =>
  btoa(encodeURIComponent(JSON.stringify(g)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

const decode = (s: string): SerializedGraph | null => {
  try {
    const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
    const g = JSON.parse(decodeURIComponent(atob(b64)));
    if (!g || g.v !== 1 || !Array.isArray(g.nodes)) return null;
    return g as SerializedGraph;
  } catch {
    return null;
  }
};

export const buildShareUrl = (g: SerializedGraph): string => {
  const { origin, pathname } = window.location;
  return `${origin}${pathname}#${HASH_KEY}=${encode(g)}`;
};

export const readGraphFromHash = (): SerializedGraph | null => {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const g = params.get(HASH_KEY);
  return g ? decode(g) : null;
};

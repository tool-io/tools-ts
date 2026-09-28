import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly vertices: readonly string[];
  readonly sources: readonly string[];
  readonly targets: readonly string[];
};
export type Output = {
  readonly componentCount: number;
  readonly bridgeCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    vertices: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    sources: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    targets: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["vertices", "sources", "targets"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    componentCount: { type: "integer" },
    bridgeCount: { type: "integer" },
  },
  required: ["componentCount", "bridgeCount"],
} as const;
/** Count undirected vertex components after removing bridges, including isolated vertices; parallel edges and self-loops are preserved. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { vertices, sources, targets } = request;
  const compute = (): Output => {
    H.sameLength(sources, targets);
    H.domain(new Set(vertices).size === vertices.length);
    const adj: { to: number; edge: number }[][] = vertices.map(() => []);
    for (let i = 0; i < sources.length; i++) {
      const a = vertices.indexOf(sources[i]),
        b = vertices.indexOf(targets[i]);
      H.domain(
        a >= 0 && b >= 0,
        "sources",
        "List every edge endpoint as a vertex.",
      );
      adj[a].push({ to: b, edge: i });
      adj[b].push({ to: a, edge: i });
    }
    const tin = vertices.map(() => -1),
      low = vertices.map(() => 0),
      bridges = new Set<number>();
    let timer = 0;
    const visit = (v: number, parentEdge: number): void => {
      tin[v] = low[v] = timer++;
      for (const e of adj[v]) {
        if (e.edge === parentEdge) continue;
        if (tin[e.to] < 0) {
          visit(e.to, e.edge);
          low[v] = Math.min(low[v], low[e.to]);
          if (low[e.to] > tin[v]) bridges.add(e.edge);
        } else low[v] = Math.min(low[v], tin[e.to]);
      }
    };
    for (let v = 0; v < vertices.length; v++) if (tin[v] < 0) visit(v, -1);
    const seen = new Set<number>();
    let componentCount = 0;
    for (let v = 0; v < vertices.length; v++)
      if (!seen.has(v)) {
        componentCount++;
        const stack = [v];
        seen.add(v);
        while (stack.length) {
          const u = stack.pop();
          if (u === undefined) break;
          for (const e of adj[u])
            if (!bridges.has(e.edge) && !seen.has(e.to)) {
              seen.add(e.to);
              stack.push(e.to);
            }
        }
      }
    return { componentCount, bridgeCount: bridges.size };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    vertices: ["A", "B", "C"],
    sources: ["A", "B"],
    targets: ["B", "C"],
  },
  output: { componentCount: 3, bridgeCount: 2 },
} satisfies ToolExample<Input, Output>;
export const edgeBiconnectedComponentCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graph/edge-biconnected-component-count",
    title: "Edge Biconnected Component Count Tool",
    description:
      "Count undirected vertex components after removing bridges, including isolated vertices; parallel edges and self-loops are preserved.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        vertices: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        sources: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        targets: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["vertices", "sources", "targets"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        componentCount: { type: "integer" },
        bridgeCount: { type: "integer" },
      },
      required: ["componentCount", "bridgeCount"],
    },
    ports: {
      inputs: [
        {
          id: "vertices",
          label: "Vertices",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "sources",
          label: "Sources",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "targets",
          label: "Targets",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "componentCount",
          label: "Component Count",
          valueType: { type: "integer" },
        },
        {
          id: "bridgeCount",
          label: "Bridge Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = edgeBiconnectedComponentCountTool.execute;
export default edgeBiconnectedComponentCountTool;

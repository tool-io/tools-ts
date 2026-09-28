import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: readonly string[];
  readonly second: readonly string[];
};
export type Output = {
  readonly shared: readonly string[];
  readonly count: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    second: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["first", "second"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shared: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    count: { type: "integer" },
  },
  required: ["shared", "count"],
} as const;
/** Calculate bipartite projection shared neighbor pair from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second } = request;
  const compute = (): Output => {
    const a = new Set(first),
      b = new Set(second),
      shared = [...a].filter((x) => b.has(x));
    return { shared, count: shared.length };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: ["x", "y", "y"], second: ["y", "z"] },
  output: { shared: ["y"], count: 1 },
} satisfies ToolExample<Input, Output>;
export const bipartiteProjectionSharedNeighborPairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "graph/bipartite-projection-shared-neighbor-pair",
      title: "Bipartite Projection Shared Neighbor Pair Tool",
      description:
        "Calculate bipartite projection shared neighbor pair from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          first: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          second: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["first", "second"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          shared: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          count: { type: "integer" },
        },
        required: ["shared", "count"],
      },
      ports: {
        inputs: [
          {
            id: "first",
            label: "First",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "second",
            label: "Second",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
        outputs: [
          {
            id: "shared",
            label: "Shared",
            valueType: { type: "list", items: { type: "string" } },
          },
          { id: "count", label: "Count", valueType: { type: "integer" } },
        ],
      },
    },
    calculate,
  });
export const run = bipartiteProjectionSharedNeighborPairTool.execute;
export default bipartiteProjectionSharedNeighborPairTool;

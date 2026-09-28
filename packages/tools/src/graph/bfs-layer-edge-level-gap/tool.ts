import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstLevel: number;
  readonly secondLevel: number;
  readonly directed: boolean;
};
export type Output = { readonly gap: number; readonly compatible: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstLevel: { type: "integer", minimum: 0 },
    secondLevel: { type: "integer", minimum: 0 },
    directed: { type: "boolean" },
  },
  required: ["firstLevel", "secondLevel", "directed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "integer" }, compatible: { type: "boolean" } },
  required: ["gap", "compatible"],
} as const;
/** Check the necessary BFS level constraint for a directed edge from first to second or an undirected edge. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstLevel, secondLevel, directed } = request;
  const compute = (): Output => {
    H.integer(firstLevel, 0);
    H.integer(secondLevel, 0);
    const gap = secondLevel - firstLevel;
    return { gap, compatible: directed ? gap <= 1 : Math.abs(gap) <= 1 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstLevel: 2, secondLevel: 4, directed: false },
  output: { gap: 2, compatible: false },
} satisfies ToolExample<Input, Output>;
export const bfsLayerEdgeLevelGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graph/bfs-layer-edge-level-gap",
    title: "Bfs Layer Edge Level Gap Tool",
    description:
      "Check the necessary BFS level constraint for a directed edge from first to second or an undirected edge.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstLevel: { type: "integer", minimum: 0 },
        secondLevel: { type: "integer", minimum: 0 },
        directed: { type: "boolean" },
      },
      required: ["firstLevel", "secondLevel", "directed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gap: { type: "integer" }, compatible: { type: "boolean" } },
      required: ["gap", "compatible"],
    },
    ports: {
      inputs: [
        {
          id: "firstLevel",
          label: "First Level",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondLevel",
          label: "Second Level",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "directed",
          label: "Directed",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "gap", label: "Gap", valueType: { type: "integer" } },
        {
          id: "compatible",
          label: "Compatible",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = bfsLayerEdgeLevelGapTool.execute;
export default bfsLayerEdgeLevelGapTool;

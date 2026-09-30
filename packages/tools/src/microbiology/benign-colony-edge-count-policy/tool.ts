import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly interior: number;
  readonly edge: number;
  readonly edgeIncluded: boolean;
  readonly usableArea: number;
};
export type Output = { readonly count: number; readonly countPerArea: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    interior: { type: "integer", minimum: 0 },
    edge: { type: "integer", minimum: 0 },
    edgeIncluded: { type: "boolean" },
    usableArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["interior", "edge", "edgeIncluded", "usableArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { count: { type: "integer" }, countPerArea: { type: "number" } },
  required: ["count", "countPerArea"],
} as const;
/** Count supplied benign demonstration observations with an explicit edge policy, without organism identification or culturing guidance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { interior, edge, edgeIncluded, usableArea } = request;
  const compute = (): Output => {
    H.integer(interior, 0);
    H.integer(edge, 0);
    H.positive(usableArea);
    return {
      count: interior + (edgeIncluded ? edge : 0),
      countPerArea: (interior + (edgeIncluded ? edge : 0)) / usableArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { interior: 20, edge: 4, edgeIncluded: true, usableArea: 2 },
  output: { count: 24, countPerArea: 12 },
} satisfies ToolExample<Input, Output>;
export const benignColonyEdgeCountPolicyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "microbiology/benign-colony-edge-count-policy",
    title: "Benign Colony Edge Count Policy Tool",
    description:
      "Count supplied benign demonstration observations with an explicit edge policy, without organism identification or culturing guidance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        interior: { type: "integer", minimum: 0 },
        edge: { type: "integer", minimum: 0 },
        edgeIncluded: { type: "boolean" },
        usableArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["interior", "edge", "edgeIncluded", "usableArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        count: { type: "integer" },
        countPerArea: { type: "number" },
      },
      required: ["count", "countPerArea"],
    },
    ports: {
      inputs: [
        {
          id: "interior",
          label: "Interior",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "edge",
          label: "Edge",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "edgeIncluded",
          label: "Edge Included",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "usableArea",
          label: "Usable Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "count", label: "Count", valueType: { type: "integer" } },
        {
          id: "countPerArea",
          label: "Count Per Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = benignColonyEdgeCountPolicyTool.execute;
export default benignColonyEdgeCountPolicyTool;

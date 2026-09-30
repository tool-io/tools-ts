import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly nodes: readonly number[];
  readonly origin: number;
};
export type Output = { readonly nodes: readonly number[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nodes: { type: "array", maxItems: 256, items: { type: "number" } },
    origin: { type: "number" },
  },
  required: ["nodes", "origin"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nodes: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["nodes"],
} as const;
/** Calculate interpolation node origin shift from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { nodes, origin } = input;
  const compute = (): Output => {
    return { nodes: nodes.map((x) => x - origin) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { nodes: [2, 4, 7], origin: 2 },
  output: { nodes: [0, 2, 5] },
} satisfies ToolExample<Input, Output>;
export const interpolationNodeOriginShiftTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "interpolation/interpolation-node-origin-shift",
    title: "Interpolation Node Origin Shift Tool",
    description:
      "Calculate interpolation node origin shift from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nodes: { type: "array", maxItems: 256, items: { type: "number" } },
        origin: { type: "number" },
      },
      required: ["nodes", "origin"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nodes: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["nodes"],
    },
    ports: {
      inputs: [
        {
          id: "nodes",
          label: "Nodes",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "origin",
          label: "Origin",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "nodes",
          label: "Nodes",
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
    },
  },
  calculate,
});
export const run = interpolationNodeOriginShiftTool.execute;
export default interpolationNodeOriginShiftTool;

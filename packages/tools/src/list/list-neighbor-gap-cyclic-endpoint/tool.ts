import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly positions: readonly number[];
  readonly period: number;
};
export type Output = { readonly wrapGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    positions: { type: "array", maxItems: 256, items: { type: "number" } },
    period: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["positions", "period"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { wrapGap: { type: "number" } },
  required: ["wrapGap"],
} as const;
/** Calculate list neighbor gap cyclic endpoint from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { positions, period } = input;
  const compute = (): Output => {
    H.positive(period);
    H.domain(
      positions.length > 0 &&
        positions.every(
          (x, i) => x >= 0 && x < period && (i === 0 || x > positions[i - 1]),
        ),
    );
    return { wrapGap: period - positions[positions.length - 1] + positions[0] };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { positions: [2, 5, 8], period: 10 },
  output: { wrapGap: 4 },
} satisfies ToolExample<Input, Output>;
export const listNeighborGapCyclicEndpointTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "list/list-neighbor-gap-cyclic-endpoint",
    title: "List Neighbor Gap Cyclic Endpoint Tool",
    description:
      "Calculate list neighbor gap cyclic endpoint from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        positions: { type: "array", maxItems: 256, items: { type: "number" } },
        period: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["positions", "period"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { wrapGap: { type: "number" } },
      required: ["wrapGap"],
    },
    ports: {
      inputs: [
        {
          id: "positions",
          label: "Positions",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "period",
          label: "Period",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "wrapGap", label: "Wrap Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = listNeighborGapCyclicEndpointTool.execute;
export default listNeighborGapCyclicEndpointTool;

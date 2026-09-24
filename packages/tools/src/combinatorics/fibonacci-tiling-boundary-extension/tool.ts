import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previous: number;
  readonly beforePrevious: number;
};
export type Output = { readonly count: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previous: { type: "integer", minimum: 0 },
    beforePrevious: { type: "integer", minimum: 0 },
  },
  required: ["previous", "beforePrevious"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { count: { type: "integer" } },
  required: ["count"],
} as const;
/** Calculate fibonacci tiling boundary extension from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { previous, beforePrevious } = input;
  const compute = (): Output => {
    H.integer(previous, 0);
    H.integer(beforePrevious, 0);
    return { count: previous + beforePrevious };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { previous: 5, beforePrevious: 3 },
  output: { count: 8 },
} satisfies ToolExample<Input, Output>;
export const fibonacciTilingBoundaryExtensionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "combinatorics/fibonacci-tiling-boundary-extension",
    title: "Fibonacci Tiling Boundary Extension Tool",
    description:
      "Calculate fibonacci tiling boundary extension from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previous: { type: "integer", minimum: 0 },
        beforePrevious: { type: "integer", minimum: 0 },
      },
      required: ["previous", "beforePrevious"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { count: { type: "integer" } },
      required: ["count"],
    },
    ports: {
      inputs: [
        {
          id: "previous",
          label: "Previous",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "beforePrevious",
          label: "Before Previous",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "count", label: "Count", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = fibonacciTilingBoundaryExtensionTool.execute;
export default fibonacciTilingBoundaryExtensionTool;

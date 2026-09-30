import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly x: number;
  readonly first: number;
  readonly second: number;
  readonly third: number;
};
export type Output = { readonly firstWeight: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    x: { type: "number" },
    first: { type: "number" },
    second: { type: "number" },
    third: { type: "number" },
  },
  required: ["x", "first", "second", "third"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { firstWeight: { type: "number" } },
  required: ["firstWeight"],
} as const;
/** Calculate quadratic interpolation one abscissa difference from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { x, first, second, third } = input;
  const compute = (): Output => {
    H.domain(first !== second && first !== third && second !== third);
    return {
      firstWeight:
        ((x - second) / (first - second)) * ((x - third) / (first - third)),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { x: 1, first: 0, second: 2, third: 4 },
  output: { firstWeight: 0.375 },
} satisfies ToolExample<Input, Output>;
export const quadraticInterpolationOneAbscissaDifferenceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "interpolation/quadratic-interpolation-one-abscissa-difference",
      title: "Quadratic Interpolation One Abscissa Difference Tool",
      description:
        "Calculate quadratic interpolation one abscissa difference from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          x: { type: "number" },
          first: { type: "number" },
          second: { type: "number" },
          third: { type: "number" },
        },
        required: ["x", "first", "second", "third"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { firstWeight: { type: "number" } },
        required: ["firstWeight"],
      },
      ports: {
        inputs: [
          {
            id: "x",
            label: "X",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "first",
            label: "First",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "second",
            label: "Second",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "third",
            label: "Third",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "firstWeight",
            label: "First Weight",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = quadraticInterpolationOneAbscissaDifferenceTool.execute;
export default quadraticInterpolationOneAbscissaDifferenceTool;

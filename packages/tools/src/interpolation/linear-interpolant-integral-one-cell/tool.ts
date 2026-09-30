import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly leftX: number;
  readonly rightX: number;
  readonly leftY: number;
  readonly rightY: number;
};
export type Output = { readonly integral: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftX: { type: "number" },
    rightX: { type: "number" },
    leftY: { type: "number" },
    rightY: { type: "number" },
  },
  required: ["leftX", "rightX", "leftY", "rightY"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { integral: { type: "number" } },
  required: ["integral"],
} as const;
/** Calculate linear interpolant integral one cell from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { leftX, rightX, leftY, rightY } = input;
  const compute = (): Output => {
    H.domain(leftX < rightX);
    return { integral: (rightX - leftX) * (leftY / 2 + rightY / 2) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { leftX: 1, rightX: 4, leftY: 2, rightY: 6 },
  output: { integral: 12 },
} satisfies ToolExample<Input, Output>;
export const linearInterpolantIntegralOneCellTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "interpolation/linear-interpolant-integral-one-cell",
    title: "Linear Interpolant Integral One Cell Tool",
    description:
      "Calculate linear interpolant integral one cell from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leftX: { type: "number" },
        rightX: { type: "number" },
        leftY: { type: "number" },
        rightY: { type: "number" },
      },
      required: ["leftX", "rightX", "leftY", "rightY"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { integral: { type: "number" } },
      required: ["integral"],
    },
    ports: {
      inputs: [
        {
          id: "leftX",
          label: "Left X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rightX",
          label: "Right X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "leftY",
          label: "Left Y",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rightY",
          label: "Right Y",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "integral", label: "Integral", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = linearInterpolantIntegralOneCellTool.execute;
export default linearInterpolantIntegralOneCellTool;

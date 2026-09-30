import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly left: number;
  readonly right: number;
  readonly observedMidpoint: number;
};
export type Output = {
  readonly expectedMidpoint: number;
  readonly gap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    left: { type: "number" },
    right: { type: "number" },
    observedMidpoint: { type: "number" },
  },
  required: ["left", "right", "observedMidpoint"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { expectedMidpoint: { type: "number" }, gap: { type: "number" } },
  required: ["expectedMidpoint", "gap"],
} as const;
/** Calculate linear interpolant midpoint symmetry gap from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { left, right, observedMidpoint } = input;
  const compute = (): Output => {
    const expectedMidpoint = left / 2 + right / 2;
    return { expectedMidpoint, gap: observedMidpoint - expectedMidpoint };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { left: 2, right: 8, observedMidpoint: 6 },
  output: { expectedMidpoint: 5, gap: 1 },
} satisfies ToolExample<Input, Output>;
export const linearInterpolantMidpointSymmetryGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "interpolation/linear-interpolant-midpoint-symmetry-gap",
      title: "Linear Interpolant Midpoint Symmetry Gap Tool",
      description:
        "Calculate linear interpolant midpoint symmetry gap from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          left: { type: "number" },
          right: { type: "number" },
          observedMidpoint: { type: "number" },
        },
        required: ["left", "right", "observedMidpoint"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          expectedMidpoint: { type: "number" },
          gap: { type: "number" },
        },
        required: ["expectedMidpoint", "gap"],
      },
      ports: {
        inputs: [
          {
            id: "left",
            label: "Left",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "right",
            label: "Right",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "observedMidpoint",
            label: "Observed Midpoint",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "expectedMidpoint",
            label: "Expected Midpoint",
            valueType: { type: "number" },
          },
          { id: "gap", label: "Gap", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = linearInterpolantMidpointSymmetryGapTool.execute;
export default linearInterpolantMidpointSymmetryGapTool;

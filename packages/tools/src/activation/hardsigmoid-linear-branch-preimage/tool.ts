import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly output: number;
  readonly slope: number;
  readonly intercept: number;
};
export type Output = {
  readonly input: number;
  readonly branchLower: number;
  readonly branchUpper: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    output: { type: "number", exclusiveMinimum: 0, exclusiveMaximum: 1 },
    slope: { type: "number", exclusiveMinimum: 0 },
    intercept: { type: "number" },
  },
  required: ["output", "slope", "intercept"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    input: { type: "number" },
    branchLower: { type: "number" },
    branchUpper: { type: "number" },
  },
  required: ["input", "branchLower", "branchUpper"],
} as const;
/** Invert only the open linear branch of clamp(slope*x+intercept,0,1). */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { output, slope, intercept } = input;
  const compute = (): Output => {
    H.positive(slope);
    H.domain(output > 0 && output < 1);
    return {
      input: (output - intercept) / slope,
      branchLower: -intercept / slope,
      branchUpper: (1 - intercept) / slope,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { output: 0.5, slope: 0.25, intercept: 0.5 },
  output: { input: 0, branchLower: -2, branchUpper: 2 },
} satisfies ToolExample<Input, Output>;
export const hardsigmoidLinearBranchPreimageTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "activation/hardsigmoid-linear-branch-preimage",
    title: "HardSigmoid Linear Branch Preimage Tool",
    description:
      "Invert only the open linear branch of clamp(slope*x+intercept,0,1).",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        output: { type: "number", exclusiveMinimum: 0, exclusiveMaximum: 1 },
        slope: { type: "number", exclusiveMinimum: 0 },
        intercept: { type: "number" },
      },
      required: ["output", "slope", "intercept"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        input: { type: "number" },
        branchLower: { type: "number" },
        branchUpper: { type: "number" },
      },
      required: ["input", "branchLower", "branchUpper"],
    },
    ports: {
      inputs: [
        {
          id: "output",
          label: "Output",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "slope",
          label: "Slope",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "intercept",
          label: "Intercept",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "input", label: "Input", valueType: { type: "number" } },
        {
          id: "branchLower",
          label: "Branch Lower",
          valueType: { type: "number" },
        },
        {
          id: "branchUpper",
          label: "Branch Upper",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = hardsigmoidLinearBranchPreimageTool.execute;
export default hardsigmoidLinearBranchPreimageTool;

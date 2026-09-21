import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly leading: number;
  readonly linear: number;
  readonly suppliedRootSum: number;
  readonly suppliedVariableScale: number;
};
export type Output = {
  readonly expectedScaledSum: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leading: { type: "number" },
    linear: { type: "number" },
    suppliedRootSum: { type: "number" },
    suppliedVariableScale: { type: "number" },
  },
  required: ["leading", "linear", "suppliedRootSum", "suppliedVariableScale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedScaledSum: { type: "number" },
    residual: { type: "number" },
  },
  required: ["expectedScaledSum", "residual"],
} as const;
/** Compare a supplied scaled quadratic root sum to Vieta’s coefficient ratio without solving for roots. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { leading, linear, suppliedRootSum, suppliedVariableScale } = request;
  const compute = (): Output => {
    H.domain(leading !== 0 && suppliedVariableScale !== 0);
    return {
      expectedScaledSum: (-linear / leading) * suppliedVariableScale,
      residual: suppliedRootSum + (linear / leading) * suppliedVariableScale,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    leading: 2,
    linear: -6,
    suppliedRootSum: 7,
    suppliedVariableScale: 2,
  },
  output: { expectedScaledSum: 6, residual: 1 },
} satisfies ToolExample<Input, Output>;
export const quadraticRootSumScaleResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "algebra/quadratic-root-sum-scale-residual",
    title: "Quadratic Root Sum Scale Residual Tool",
    description:
      "Compare a supplied scaled quadratic root sum to Vieta’s coefficient ratio without solving for roots.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leading: { type: "number" },
        linear: { type: "number" },
        suppliedRootSum: { type: "number" },
        suppliedVariableScale: { type: "number" },
      },
      required: [
        "leading",
        "linear",
        "suppliedRootSum",
        "suppliedVariableScale",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expectedScaledSum: { type: "number" },
        residual: { type: "number" },
      },
      required: ["expectedScaledSum", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "leading",
          label: "Leading",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "linear",
          label: "Linear",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedRootSum",
          label: "Supplied Root Sum",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedVariableScale",
          label: "Supplied Variable Scale",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "expectedScaledSum",
          label: "Expected Scaled Sum",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = quadraticRootSumScaleResidualTool.execute;
export default quadraticRootSumScaleResidualTool;

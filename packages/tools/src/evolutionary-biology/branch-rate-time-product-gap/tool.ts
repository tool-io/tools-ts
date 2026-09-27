import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly branchRate: number;
  readonly elapsedTime: number;
  readonly suppliedBranchLength: number;
};
export type Output = {
  readonly expectedBranchLength: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    branchRate: { type: "number", minimum: 0 },
    elapsedTime: { type: "number", minimum: 0 },
    suppliedBranchLength: { type: "number", minimum: 0 },
  },
  required: ["branchRate", "elapsedTime", "suppliedBranchLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedBranchLength: { type: "number" },
    residual: { type: "number" },
  },
  required: ["expectedBranchLength", "residual"],
} as const;
/** Compare an explicit branch substitution-rate/time product with a supplied length; no clock model is fitted. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { branchRate, elapsedTime, suppliedBranchLength } = request;
  const compute = (): Output => {
    H.domain(branchRate >= 0 && elapsedTime >= 0 && suppliedBranchLength >= 0);
    return {
      expectedBranchLength: branchRate * elapsedTime,
      residual: suppliedBranchLength - branchRate * elapsedTime,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { branchRate: 0.2, elapsedTime: 5, suppliedBranchLength: 1.2 },
  output: { expectedBranchLength: 1, residual: 0.19999999999999996 },
} satisfies ToolExample<Input, Output>;
export const branchRateTimeProductGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "evolutionary-biology/branch-rate-time-product-gap",
    title: "Branch Rate Time Product Gap Tool",
    description:
      "Compare an explicit branch substitution-rate/time product with a supplied length; no clock model is fitted.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        branchRate: { type: "number", minimum: 0 },
        elapsedTime: { type: "number", minimum: 0 },
        suppliedBranchLength: { type: "number", minimum: 0 },
      },
      required: ["branchRate", "elapsedTime", "suppliedBranchLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expectedBranchLength: { type: "number" },
        residual: { type: "number" },
      },
      required: ["expectedBranchLength", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "branchRate",
          label: "Branch Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "elapsedTime",
          label: "Elapsed Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedBranchLength",
          label: "Supplied Branch Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "expectedBranchLength",
          label: "Expected Branch Length",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = branchRateTimeProductGapTool.execute;
export default branchRateTimeProductGapTool;

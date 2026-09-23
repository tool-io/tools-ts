import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossFlow: number;
  readonly recycleFraction: number;
  readonly suppliedRecoveryFraction: number;
};
export type Output = {
  readonly recycledFlow: number;
  readonly recoveredRecycle: number;
  readonly netUnrecycled: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossFlow: { type: "number", minimum: 0 },
    recycleFraction: { type: "number", minimum: 0, maximum: 1 },
    suppliedRecoveryFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["grossFlow", "recycleFraction", "suppliedRecoveryFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recycledFlow: { type: "number" },
    recoveredRecycle: { type: "number" },
    netUnrecycled: { type: "number" },
  },
  required: ["recycledFlow", "recoveredRecycle", "netUnrecycled"],
} as const;
/** Supplied steady flow-split accounting without designing a process or selecting operating conditions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossFlow, recycleFraction, suppliedRecoveryFraction } = request;
  const compute = (): Output => {
    H.domain(grossFlow >= 0);
    H.probability(recycleFraction);
    H.probability(suppliedRecoveryFraction);
    return {
      recycledFlow: grossFlow * recycleFraction,
      recoveredRecycle: grossFlow * recycleFraction * suppliedRecoveryFraction,
      netUnrecycled: grossFlow * (1 - recycleFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    grossFlow: 100,
    recycleFraction: 0.4,
    suppliedRecoveryFraction: 0.75,
  },
  output: { recycledFlow: 40, recoveredRecycle: 30, netUnrecycled: 60 },
} satisfies ToolExample<Input, Output>;
export const recycleSplitFlowFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "chemical-engineering/recycle-split-flow-factor",
    title: "Recycle Split Flow Factor Tool",
    description:
      "Supplied steady flow-split accounting without designing a process or selecting operating conditions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossFlow: { type: "number", minimum: 0 },
        recycleFraction: { type: "number", minimum: 0, maximum: 1 },
        suppliedRecoveryFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["grossFlow", "recycleFraction", "suppliedRecoveryFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recycledFlow: { type: "number" },
        recoveredRecycle: { type: "number" },
        netUnrecycled: { type: "number" },
      },
      required: ["recycledFlow", "recoveredRecycle", "netUnrecycled"],
    },
    ports: {
      inputs: [
        {
          id: "grossFlow",
          label: "Gross Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recycleFraction",
          label: "Recycle Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedRecoveryFraction",
          label: "Supplied Recovery Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "recycledFlow",
          label: "Recycled Flow",
          valueType: { type: "number" },
        },
        {
          id: "recoveredRecycle",
          label: "Recovered Recycle",
          valueType: { type: "number" },
        },
        {
          id: "netUnrecycled",
          label: "Net Unrecycled",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = recycleSplitFlowFactorTool.execute;
export default recycleSplitFlowFactorTool;

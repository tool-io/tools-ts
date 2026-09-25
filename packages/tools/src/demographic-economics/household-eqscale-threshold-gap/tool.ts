import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly householdIncome: number;
  readonly suppliedScale: number;
  readonly thresholdPerEquivalent: number;
};
export type Output = {
  readonly equivalentIncome: number;
  readonly gap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    householdIncome: { type: "number" },
    suppliedScale: { type: "number", exclusiveMinimum: 0 },
    thresholdPerEquivalent: { type: "number" },
  },
  required: ["householdIncome", "suppliedScale", "thresholdPerEquivalent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { equivalentIncome: { type: "number" }, gap: { type: "number" } },
  required: ["equivalentIncome", "gap"],
} as const;
/** Income equivalization under a caller-supplied household scale and comparison threshold. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { householdIncome, suppliedScale, thresholdPerEquivalent } = request;
  const compute = (): Output => {
    H.positive(suppliedScale);
    return {
      equivalentIncome: householdIncome / suppliedScale,
      gap: householdIncome / suppliedScale - thresholdPerEquivalent,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    householdIncome: 3000,
    suppliedScale: 1.5,
    thresholdPerEquivalent: 1800,
  },
  output: { equivalentIncome: 2000, gap: 200 },
} satisfies ToolExample<Input, Output>;
export const householdEqscaleThresholdGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "demographic-economics/household-eqscale-threshold-gap",
    title: "Household Eqscale Threshold Gap Tool",
    description:
      "Income equivalization under a caller-supplied household scale and comparison threshold.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        householdIncome: { type: "number" },
        suppliedScale: { type: "number", exclusiveMinimum: 0 },
        thresholdPerEquivalent: { type: "number" },
      },
      required: ["householdIncome", "suppliedScale", "thresholdPerEquivalent"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        equivalentIncome: { type: "number" },
        gap: { type: "number" },
      },
      required: ["equivalentIncome", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "householdIncome",
          label: "Household Income",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedScale",
          label: "Supplied Scale",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "thresholdPerEquivalent",
          label: "Threshold Per Equivalent",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "equivalentIncome",
          label: "Equivalent Income",
          valueType: { type: "number" },
        },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = householdEqscaleThresholdGapTool.execute;
export default householdEqscaleThresholdGapTool;

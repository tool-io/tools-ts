import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly inletLoad: number;
  readonly outletLoad: number;
  readonly baselineRemovalFraction: number;
};
export type Output = {
  readonly removedLoad: number;
  readonly measuredRemovalFraction: number;
  readonly residualLoadGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inletLoad: { type: "number", exclusiveMinimum: 0 },
    outletLoad: { type: "number", minimum: 0 },
    baselineRemovalFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["inletLoad", "outletLoad", "baselineRemovalFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    removedLoad: { type: "number" },
    measuredRemovalFraction: { type: "number" },
    residualLoadGap: { type: "number" },
  },
  required: ["removedLoad", "measuredRemovalFraction", "residualLoadGap"],
} as const;
/** Compare measured load balance with an explicit baseline removal fraction, permitting net load gains. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inletLoad, outletLoad, baselineRemovalFraction } = request;
  const compute = (): Output => {
    H.positive(inletLoad);
    H.domain(outletLoad >= 0);
    H.probability(baselineRemovalFraction);
    return {
      removedLoad: inletLoad - outletLoad,
      measuredRemovalFraction: (inletLoad - outletLoad) / inletLoad,
      residualLoadGap: outletLoad - inletLoad * (1 - baselineRemovalFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { inletLoad: 100, outletLoad: 30, baselineRemovalFraction: 0.8 },
  output: {
    removedLoad: 70,
    measuredRemovalFraction: 0.7,
    residualLoadGap: 10.000000000000004,
  },
} satisfies ToolExample<Input, Output>;
export const treatmentLoadBaselineGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-engineering/treatment-load-baseline-gap",
    title: "Treatment Load Baseline Gap Tool",
    description:
      "Compare measured load balance with an explicit baseline removal fraction, permitting net load gains.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inletLoad: { type: "number", exclusiveMinimum: 0 },
        outletLoad: { type: "number", minimum: 0 },
        baselineRemovalFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["inletLoad", "outletLoad", "baselineRemovalFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        removedLoad: { type: "number" },
        measuredRemovalFraction: { type: "number" },
        residualLoadGap: { type: "number" },
      },
      required: ["removedLoad", "measuredRemovalFraction", "residualLoadGap"],
    },
    ports: {
      inputs: [
        {
          id: "inletLoad",
          label: "Inlet Load",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "outletLoad",
          label: "Outlet Load",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "baselineRemovalFraction",
          label: "Baseline Removal Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "removedLoad",
          label: "Removed Load",
          valueType: { type: "number" },
        },
        {
          id: "measuredRemovalFraction",
          label: "Measured Removal Fraction",
          valueType: { type: "number" },
        },
        {
          id: "residualLoadGap",
          label: "Residual Load Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = treatmentLoadBaselineGapTool.execute;
export default treatmentLoadBaselineGapTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wetMass: number;
  readonly waterMass: number;
  readonly reportDryBasis: boolean;
};
export type Output = {
  readonly denominatorMass: number;
  readonly waterRatio: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wetMass: { type: "number", minimum: 0 },
    waterMass: { type: "number", minimum: 0 },
    reportDryBasis: { type: "boolean" },
  },
  required: ["wetMass", "waterMass", "reportDryBasis"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominatorMass: { type: "number" },
    waterRatio: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["denominatorMass", "waterRatio", "defined"],
} as const;
/** Compare supplied water mass on wet or dry material bases without processing guidance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wetMass, waterMass, reportDryBasis } = request;
  const compute = (): Output => {
    H.domain(wetMass >= 0 && waterMass >= 0 && waterMass <= wetMass);
    return {
      denominatorMass: wetMass - (reportDryBasis ? waterMass : 0),
      waterRatio:
        wetMass - (reportDryBasis ? waterMass : 0) > 0
          ? waterMass / (wetMass - (reportDryBasis ? waterMass : 0))
          : 0,
      defined: wetMass - (reportDryBasis ? waterMass : 0) > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wetMass: 100, waterMass: 60, reportDryBasis: true },
  output: { denominatorMass: 40, waterRatio: 1.5, defined: true },
} satisfies ToolExample<Input, Output>;
export const compostBatchWaterBaseFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "permaculture/compost-batch-water-base-flag",
    title: "Compost Batch Water Base Flag Tool",
    description:
      "Compare supplied water mass on wet or dry material bases without processing guidance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wetMass: { type: "number", minimum: 0 },
        waterMass: { type: "number", minimum: 0 },
        reportDryBasis: { type: "boolean" },
      },
      required: ["wetMass", "waterMass", "reportDryBasis"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominatorMass: { type: "number" },
        waterRatio: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["denominatorMass", "waterRatio", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "wetMass",
          label: "Wet Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "waterMass",
          label: "Water Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reportDryBasis",
          label: "Report Dry Basis",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "denominatorMass",
          label: "Denominator Mass",
          valueType: { type: "number" },
        },
        {
          id: "waterRatio",
          label: "Water Ratio",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = compostBatchWaterBaseFlagTool.execute;
export default compostBatchWaterBaseFlagTool;

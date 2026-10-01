import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baselineDiameter: number;
  readonly followupDiameter: number;
  readonly measurementResolution: number;
};
export type Output = {
  readonly absoluteChange: number;
  readonly percentChange: number;
  readonly resolutionUnits: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baselineDiameter: { type: "number", exclusiveMinimum: 0 },
    followupDiameter: { type: "number", minimum: 0 },
    measurementResolution: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["baselineDiameter", "followupDiameter", "measurementResolution"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    absoluteChange: { type: "number" },
    percentChange: { type: "number" },
    resolutionUnits: { type: "number" },
  },
  required: ["absoluteChange", "percentChange", "resolutionUnits"],
} as const;
/** Descriptive research diameter change and instrument-resolution units, without response criteria, staging or a clinical decision. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baselineDiameter, followupDiameter, measurementResolution } = request;
  const compute = (): Output => {
    H.positive(baselineDiameter);
    H.domain(followupDiameter >= 0);
    H.positive(measurementResolution);
    return {
      absoluteChange: followupDiameter - baselineDiameter,
      percentChange:
        (100 * (followupDiameter - baselineDiameter)) / baselineDiameter,
      resolutionUnits:
        (followupDiameter - baselineDiameter) / measurementResolution,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    baselineDiameter: 20,
    followupDiameter: 15,
    measurementResolution: 0.5,
  },
  output: { absoluteChange: -5, percentChange: -25, resolutionUnits: -10 },
} satisfies ToolExample<Input, Output>;
export const tumorResearchDiameterPercentChangeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "oncology/tumor-research-diameter-percent-change",
    title: "Tumor Research Diameter Percent Change Tool",
    description:
      "Descriptive research diameter change and instrument-resolution units, without response criteria, staging or a clinical decision.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baselineDiameter: { type: "number", exclusiveMinimum: 0 },
        followupDiameter: { type: "number", minimum: 0 },
        measurementResolution: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "baselineDiameter",
        "followupDiameter",
        "measurementResolution",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        absoluteChange: { type: "number" },
        percentChange: { type: "number" },
        resolutionUnits: { type: "number" },
      },
      required: ["absoluteChange", "percentChange", "resolutionUnits"],
    },
    ports: {
      inputs: [
        {
          id: "baselineDiameter",
          label: "Baseline Diameter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "followupDiameter",
          label: "Followup Diameter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measurementResolution",
          label: "Measurement Resolution",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "absoluteChange",
          label: "Absolute Change",
          valueType: { type: "number" },
        },
        {
          id: "percentChange",
          label: "Percent Change",
          valueType: { type: "number" },
        },
        {
          id: "resolutionUnits",
          label: "Resolution Units",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = tumorResearchDiameterPercentChangeTool.execute;
export default tumorResearchDiameterPercentChangeTool;

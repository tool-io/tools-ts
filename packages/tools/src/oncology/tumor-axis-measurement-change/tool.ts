import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baselineAxis: number;
  readonly followupAxis: number;
};
export type Output = {
  readonly absoluteChange: number;
  readonly fractionalChange: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baselineAxis: { type: "number", exclusiveMinimum: 0 },
    followupAxis: { type: "number", minimum: 0 },
  },
  required: ["baselineAxis", "followupAxis"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    absoluteChange: { type: "number" },
    fractionalChange: { type: "number" },
  },
  required: ["absoluteChange", "fractionalChange"],
} as const;
/** Compare explicit same-axis tumor measurements without assigning response categories or progression criteria. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baselineAxis, followupAxis } = request;
  const compute = (): Output => {
    (H.domain(baselineAxis > 0, "baselineAxis"), baselineAxis);
    H.domain(followupAxis >= 0, "followupAxis");
    return {
      absoluteChange: followupAxis - baselineAxis,
      fractionalChange: (followupAxis - baselineAxis) / baselineAxis,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { baselineAxis: 20, followupAxis: 15 },
  output: { absoluteChange: -5, fractionalChange: -0.25 },
} satisfies ToolExample<Input, Output>;
export const tumorAxisMeasurementChangeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["oncology", "health and medicine"],
      keywords: ["oncology", "health and medicine"],
    },
    id: "oncology/tumor-axis-measurement-change",
    title: "Tumor Axis Measurement Change",
    description:
      "Compare explicit same-axis tumor measurements without assigning response categories or progression criteria.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baselineAxis: { type: "number", exclusiveMinimum: 0 },
        followupAxis: { type: "number", minimum: 0 },
      },
      required: ["baselineAxis", "followupAxis"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        absoluteChange: { type: "number" },
        fractionalChange: { type: "number" },
      },
      required: ["absoluteChange", "fractionalChange"],
    },
    ports: {
      inputs: [
        {
          id: "baselineAxis",
          label: "Baseline Axis",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "followupAxis",
          label: "Followup Axis",
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
          id: "fractionalChange",
          label: "Fractional Change",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = tumorAxisMeasurementChangeTool.execute;
export default tumorAxisMeasurementChangeTool;

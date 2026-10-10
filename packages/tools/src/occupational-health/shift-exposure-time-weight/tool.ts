import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly exposureLevel: number;
  readonly exposureHours: number;
  readonly referenceHours: number;
};
export type Output = {
  readonly weightedContribution: number;
  readonly timeWeight: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exposureLevel: { type: "number" },
    exposureHours: { type: "number", minimum: 0 },
    referenceHours: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["exposureLevel", "exposureHours", "referenceHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weightedContribution: { type: "number" },
    timeWeight: { type: "number" },
  },
  required: ["weightedContribution", "timeWeight"],
} as const;
/** Calculate one explicitly supplied linear exposure-time contribution without selecting a regulatory TWA model or exposure limit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { exposureLevel, exposureHours, referenceHours } = request;
  const compute = (): Output => {
    H.domain(exposureHours >= 0, "exposureHours");
    (H.domain(referenceHours > 0, "referenceHours"), referenceHours);
    return {
      weightedContribution: (exposureLevel * exposureHours) / referenceHours,
      timeWeight: exposureHours / referenceHours,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { exposureLevel: 10, exposureHours: 2, referenceHours: 8 },
  output: { weightedContribution: 2.5, timeWeight: 0.25 },
} satisfies ToolExample<Input, Output>;
export const shiftExposureTimeWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "occupational-health",
        "occupational health",
        "health and medicine",
      ],
      keywords: ["occupational health", "health and medicine"],
    },
    id: "occupational-health/shift-exposure-time-weight",
    title: "Shift Exposure Time Weight",
    description:
      "Calculate one explicitly supplied linear exposure-time contribution without selecting a regulatory TWA model or exposure limit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        exposureLevel: { type: "number" },
        exposureHours: { type: "number", minimum: 0 },
        referenceHours: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["exposureLevel", "exposureHours", "referenceHours"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        weightedContribution: { type: "number" },
        timeWeight: { type: "number" },
      },
      required: ["weightedContribution", "timeWeight"],
    },
    ports: {
      inputs: [
        {
          id: "exposureLevel",
          label: "Exposure Level",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "exposureHours",
          label: "Exposure Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceHours",
          label: "Reference Hours",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "weightedContribution",
          label: "Weighted Contribution",
          valueType: { type: "number" },
        },
        {
          id: "timeWeight",
          label: "Time Weight",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = shiftExposureTimeWeightTool.execute;
export default shiftExposureTimeWeightTool;

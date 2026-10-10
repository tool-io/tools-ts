import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly chartId: string;
  readonly distanceWording: string;
  readonly referenceSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    chartId: { type: "string", maxLength: 8192, minLength: 1 },
    distanceWording: { type: "string", maxLength: 8192, minLength: 1 },
    referenceSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["chartId", "distanceWording", "referenceSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicit acuity-chart distance reference without converting visual acuity or choosing a testing distance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { chartId, distanceWording, referenceSource } = request;
  const compute = (): Output => {
    H.domain(chartId.length > 0, "chartId");
    H.domain(distanceWording.length > 0, "distanceWording");
    H.domain(referenceSource.length > 0, "referenceSource");
    return {
      token: JSON.stringify([chartId, distanceWording, referenceSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    chartId: "CH17",
    distanceWording: "6 m",
    referenceSource: "Chart instructions",
  },
  output: { token: '["CH17","6 m","Chart instructions"]' },
} satisfies ToolExample<Input, Output>;
export const acuityChartDistanceReferenceLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["ophthalmology", "health and medicine"],
      keywords: ["ophthalmology", "health and medicine"],
    },
    id: "ophthalmology/acuity-chart-distance-reference-label",
    title: "Acuity Chart Distance Reference Label",
    description:
      "Record an explicit acuity-chart distance reference without converting visual acuity or choosing a testing distance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        chartId: { type: "string", maxLength: 8192, minLength: 1 },
        distanceWording: { type: "string", maxLength: 8192, minLength: 1 },
        referenceSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["chartId", "distanceWording", "referenceSource"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "chartId",
          label: "Chart Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "distanceWording",
          label: "Distance Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "referenceSource",
          label: "Reference Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = acuityChartDistanceReferenceLabelTool.execute;
export default acuityChartDistanceReferenceLabelTool;

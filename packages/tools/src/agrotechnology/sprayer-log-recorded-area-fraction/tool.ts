import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedTreatedArea: number;
  readonly totalLoggedArea: number;
};
export type Output = { readonly fraction: number; readonly remainder: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedTreatedArea: { type: "number", minimum: 0 },
    totalLoggedArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["recordedTreatedArea", "totalLoggedArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" }, remainder: { type: "number" } },
  required: ["fraction", "remainder"],
} as const;
/** Normalize an explicitly logged treated area to compatible total logged area without recommending chemical application. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedTreatedArea, totalLoggedArea } = request;
  const compute = (): Output => {
    (H.domain(totalLoggedArea > 0, "totalLoggedArea"), totalLoggedArea);
    H.domain(
      recordedTreatedArea >= 0 && recordedTreatedArea <= totalLoggedArea,
      "recordedTreatedArea",
    );
    return {
      fraction: recordedTreatedArea / totalLoggedArea,
      remainder: totalLoggedArea - recordedTreatedArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedTreatedArea: 30, totalLoggedArea: 120 },
  output: { fraction: 0.25, remainder: 90 },
} satisfies ToolExample<Input, Output>;
export const sprayerLogRecordedAreaFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agrotechnology", "agriculture"],
      keywords: ["agrotechnology", "agriculture"],
    },
    id: "agrotechnology/sprayer-log-recorded-area-fraction",
    title: "Sprayer Log Recorded Area Fraction",
    description:
      "Normalize an explicitly logged treated area to compatible total logged area without recommending chemical application.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedTreatedArea: { type: "number", minimum: 0 },
        totalLoggedArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["recordedTreatedArea", "totalLoggedArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fraction: { type: "number" },
        remainder: { type: "number" },
      },
      required: ["fraction", "remainder"],
    },
    ports: {
      inputs: [
        {
          id: "recordedTreatedArea",
          label: "Recorded Treated Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalLoggedArea",
          label: "Total Logged Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        { id: "remainder", label: "Remainder", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = sprayerLogRecordedAreaFractionTool.execute;
export default sprayerLogRecordedAreaFractionTool;

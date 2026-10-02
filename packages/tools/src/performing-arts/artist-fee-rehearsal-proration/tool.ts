import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fullFee: number;
  readonly includedHours: number;
  readonly usedHours: number;
  readonly extraHourlyRate: number;
};
export type Output = {
  readonly includedUsed: number;
  readonly extraHours: number;
  readonly totalFee: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fullFee: { type: "number", minimum: 0 },
    includedHours: { type: "number", exclusiveMinimum: 0 },
    usedHours: { type: "number", minimum: 0 },
    extraHourlyRate: { type: "number", minimum: 0 },
  },
  required: ["fullFee", "includedHours", "usedHours", "extraHourlyRate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    includedUsed: { type: "number" },
    extraHours: { type: "number" },
    totalFee: { type: "number" },
  },
  required: ["includedUsed", "extraHours", "totalFee"],
} as const;
/** Prorate unused included rehearsal hours and add extra hours at an explicit rate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fullFee, includedHours, usedHours, extraHourlyRate } = request;
  const compute = (): Output => {
    H.positive(includedHours);
    H.domain(fullFee >= 0 && usedHours >= 0 && extraHourlyRate >= 0);
    return {
      includedUsed: Math.min(includedHours, usedHours),
      extraHours: Math.max(0, usedHours - includedHours),
      totalFee:
        (fullFee * Math.min(includedHours, usedHours)) / includedHours +
        Math.max(0, usedHours - includedHours) * extraHourlyRate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { fullFee: 200, includedHours: 4, usedHours: 3, extraHourlyRate: 60 },
  output: { includedUsed: 3, extraHours: 0, totalFee: 150 },
} satisfies ToolExample<Input, Output>;
export const artistFeeRehearsalProrationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "performing-arts/artist-fee-rehearsal-proration",
    title: "Artist Fee Rehearsal Proration Tool",
    description:
      "Prorate unused included rehearsal hours and add extra hours at an explicit rate.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fullFee: { type: "number", minimum: 0 },
        includedHours: { type: "number", exclusiveMinimum: 0 },
        usedHours: { type: "number", minimum: 0 },
        extraHourlyRate: { type: "number", minimum: 0 },
      },
      required: ["fullFee", "includedHours", "usedHours", "extraHourlyRate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        includedUsed: { type: "number" },
        extraHours: { type: "number" },
        totalFee: { type: "number" },
      },
      required: ["includedUsed", "extraHours", "totalFee"],
    },
    ports: {
      inputs: [
        {
          id: "fullFee",
          label: "Full Fee",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includedHours",
          label: "Included Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "usedHours",
          label: "Used Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "extraHourlyRate",
          label: "Extra Hourly Rate",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "includedUsed",
          label: "Included Used",
          valueType: { type: "number" },
        },
        {
          id: "extraHours",
          label: "Extra Hours",
          valueType: { type: "number" },
        },
        { id: "totalFee", label: "Total Fee", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = artistFeeRehearsalProrationTool.execute;
export default artistFeeRehearsalProrationTool;

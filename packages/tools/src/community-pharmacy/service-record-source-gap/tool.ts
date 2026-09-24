import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly serviceIds: readonly string[];
  readonly recordedDates: readonly string[];
  readonly sourceDates: readonly string[];
  readonly sourceVerified: readonly boolean[];
};
export type Output = {
  readonly dateMismatches: number;
  readonly unverifiedRecords: number;
  readonly verifiedDateMatches: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    serviceIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    recordedDates: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    sourceDates: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    sourceVerified: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: ["serviceIds", "recordedDates", "sourceDates", "sourceVerified"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dateMismatches: { type: "integer" },
    unverifiedRecords: { type: "integer" },
    verifiedDateMatches: { type: "integer" },
  },
  required: ["dateMismatches", "unverifiedRecords", "verifiedDateMatches"],
} as const;
/** Calculate service record source gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { serviceIds, recordedDates, sourceDates, sourceVerified } = request;
  const compute = (): Output => {
    H.sameLength(serviceIds, recordedDates);
    H.sameLength(serviceIds, sourceDates);
    H.sameLength(serviceIds, sourceVerified);
    recordedDates.forEach(H.dateOnly);
    sourceDates.forEach(H.dateOnly);
    return {
      dateMismatches: recordedDates.filter((x, i) => x !== sourceDates[i])
        .length,
      unverifiedRecords: sourceVerified.filter((x) => !x).length,
      verifiedDateMatches: serviceIds.filter(
        (x, i) => recordedDates[i] === sourceDates[i] && sourceVerified[i],
      ).length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    serviceIds: ["a", "b"],
    recordedDates: ["2024-01-01", "2024-01-02"],
    sourceDates: ["2024-01-01", "2024-01-03"],
    sourceVerified: [true, false],
  },
  output: { dateMismatches: 1, unverifiedRecords: 1, verifiedDateMatches: 1 },
} satisfies ToolExample<Input, Output>;
export const serviceRecordSourceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "community-pharmacy/service-record-source-gap",
    title: "Service Record Source Gap Tool",
    description:
      "Calculate service record source gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        serviceIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        recordedDates: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        sourceDates: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        sourceVerified: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: [
        "serviceIds",
        "recordedDates",
        "sourceDates",
        "sourceVerified",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dateMismatches: { type: "integer" },
        unverifiedRecords: { type: "integer" },
        verifiedDateMatches: { type: "integer" },
      },
      required: ["dateMismatches", "unverifiedRecords", "verifiedDateMatches"],
    },
    ports: {
      inputs: [
        {
          id: "serviceIds",
          label: "Service Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "recordedDates",
          label: "Recorded Dates",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "sourceDates",
          label: "Source Dates",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "sourceVerified",
          label: "Source Verified",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "dateMismatches",
          label: "Date Mismatches",
          valueType: { type: "integer" },
        },
        {
          id: "unverifiedRecords",
          label: "Unverified Records",
          valueType: { type: "integer" },
        },
        {
          id: "verifiedDateMatches",
          label: "Verified Date Matches",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = serviceRecordSourceGapTool.execute;
export default serviceRecordSourceGapTool;

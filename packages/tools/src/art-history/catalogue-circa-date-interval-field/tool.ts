import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly centralYear: number;
  readonly earlierToleranceYears: number;
  readonly laterToleranceYears: number;
};
export type Output = {
  readonly earliestYear: number;
  readonly latestYear: number;
  readonly label: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    centralYear: { type: "integer", minimum: -100000, maximum: 100000 },
    earlierToleranceYears: { type: "integer", minimum: 0, maximum: 100000 },
    laterToleranceYears: { type: "integer", minimum: 0, maximum: 100000 },
  },
  required: ["centralYear", "earlierToleranceYears", "laterToleranceYears"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    earliestYear: { type: "integer" },
    latestYear: { type: "integer" },
    label: { type: "string", maxLength: 8192 },
  },
  required: ["earliestYear", "latestYear", "label"],
} as const;
/** Represent a catalogue circa date with caller-specified asymmetric year tolerances using astronomical year numbering; no tolerance is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { centralYear, earlierToleranceYears, laterToleranceYears } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(centralYear) &&
        centralYear >= -100000 &&
        centralYear <= 100000,
      "centralYear",
    ),
      centralYear);
    (H.domain(
      Number.isSafeInteger(earlierToleranceYears) &&
        earlierToleranceYears >= 0 &&
        earlierToleranceYears <= 100000,
      "earlierToleranceYears",
    ),
      earlierToleranceYears);
    (H.domain(
      Number.isSafeInteger(laterToleranceYears) &&
        laterToleranceYears >= 0 &&
        laterToleranceYears <= 100000,
      "laterToleranceYears",
    ),
      laterToleranceYears);
    return {
      earliestYear: centralYear - earlierToleranceYears,
      latestYear: centralYear + laterToleranceYears,
      label: "circa " + centralYear,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    centralYear: 1900,
    earlierToleranceYears: 5,
    laterToleranceYears: 10,
  },
  output: { earliestYear: 1895, latestYear: 1910, label: "circa 1900" },
} satisfies ToolExample<Input, Output>;
export const catalogueCircaDateIntervalFieldTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-history/catalogue-circa-date-interval-field",
    title: "Catalogue Circa Date Interval Field Tool",
    description:
      "Represent a catalogue circa date with caller-specified asymmetric year tolerances using astronomical year numbering; no tolerance is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        centralYear: { type: "integer", minimum: -100000, maximum: 100000 },
        earlierToleranceYears: { type: "integer", minimum: 0, maximum: 100000 },
        laterToleranceYears: { type: "integer", minimum: 0, maximum: 100000 },
      },
      required: ["centralYear", "earlierToleranceYears", "laterToleranceYears"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        earliestYear: { type: "integer" },
        latestYear: { type: "integer" },
        label: { type: "string", maxLength: 8192 },
      },
      required: ["earliestYear", "latestYear", "label"],
    },
    ports: {
      inputs: [
        {
          id: "centralYear",
          label: "Central Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "earlierToleranceYears",
          label: "Earlier Tolerance Years",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "laterToleranceYears",
          label: "Later Tolerance Years",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "earliestYear",
          label: "Earliest Year",
          valueType: { type: "integer" },
        },
        {
          id: "latestYear",
          label: "Latest Year",
          valueType: { type: "integer" },
        },
        { id: "label", label: "Label", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = catalogueCircaDateIntervalFieldTool.execute;
export default catalogueCircaDateIntervalFieldTool;

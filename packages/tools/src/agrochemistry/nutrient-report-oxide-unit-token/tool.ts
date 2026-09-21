import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reportedValue: number;
  readonly suppliedElementPerOxide: number;
  readonly reportedAsOxide: boolean;
  readonly sourceToken: string;
};
export type Output = {
  readonly elementEquivalent: number;
  readonly factorSource: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportedValue: { type: "number" },
    suppliedElementPerOxide: { type: "number", exclusiveMinimum: 0 },
    reportedAsOxide: { type: "boolean" },
    sourceToken: { type: "string", maxLength: 8192 },
  },
  required: [
    "reportedValue",
    "suppliedElementPerOxide",
    "reportedAsOxide",
    "sourceToken",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elementEquivalent: { type: "number" },
    factorSource: { type: "string", maxLength: 8192 },
  },
  required: ["elementEquivalent", "factorSource"],
} as const;
/** Apply an explicitly supplied oxide-to-element mass factor while preserving source metadata; no fertilizer rate is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    reportedValue,
    suppliedElementPerOxide,
    reportedAsOxide,
    sourceToken,
  } = request;
  const compute = (): Output => {
    H.positive(suppliedElementPerOxide);
    return {
      elementEquivalent: reportedAsOxide
        ? reportedValue * suppliedElementPerOxide
        : reportedValue,
      factorSource: sourceToken,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    reportedValue: 100,
    suppliedElementPerOxide: 0.4,
    reportedAsOxide: true,
    sourceToken: "caller-table",
  },
  output: { elementEquivalent: 40, factorSource: "caller-table" },
} satisfies ToolExample<Input, Output>;
export const nutrientReportOxideUnitTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrochemistry/nutrient-report-oxide-unit-token",
    title: "Nutrient Report Oxide Unit Token Tool",
    description:
      "Apply an explicitly supplied oxide-to-element mass factor while preserving source metadata; no fertilizer rate is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reportedValue: { type: "number" },
        suppliedElementPerOxide: { type: "number", exclusiveMinimum: 0 },
        reportedAsOxide: { type: "boolean" },
        sourceToken: { type: "string", maxLength: 8192 },
      },
      required: [
        "reportedValue",
        "suppliedElementPerOxide",
        "reportedAsOxide",
        "sourceToken",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elementEquivalent: { type: "number" },
        factorSource: { type: "string", maxLength: 8192 },
      },
      required: ["elementEquivalent", "factorSource"],
    },
    ports: {
      inputs: [
        {
          id: "reportedValue",
          label: "Reported Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedElementPerOxide",
          label: "Supplied Element Per Oxide",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reportedAsOxide",
          label: "Reported As Oxide",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "sourceToken",
          label: "Source Token",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "elementEquivalent",
          label: "Element Equivalent",
          valueType: { type: "number" },
        },
        {
          id: "factorSource",
          label: "Factor Source",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = nutrientReportOxideUnitTokenTool.execute;
export default nutrientReportOxideUnitTokenTool;

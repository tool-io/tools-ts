import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reportedValue: number;
  readonly suppliedReportingLimit: number;
  readonly higherIsAbove: boolean;
};
export type Output = {
  readonly signedGap: number;
  readonly aboveUnderDirection: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportedValue: { type: "number" },
    suppliedReportingLimit: { type: "number" },
    higherIsAbove: { type: "boolean" },
  },
  required: ["reportedValue", "suppliedReportingLimit", "higherIsAbove"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedGap: { type: "number" },
    aboveUnderDirection: { type: "boolean" },
  },
  required: ["signedGap", "aboveUnderDirection"],
} as const;
/** Compare supplied assay values to an explicit reporting threshold without selecting a regulatory or health limit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reportedValue, suppliedReportingLimit, higherIsAbove } = request;
  const compute = (): Output => {
    return {
      signedGap:
        (reportedValue - suppliedReportingLimit) * (higherIsAbove ? 1 : -1),
      aboveUnderDirection: higherIsAbove
        ? reportedValue > suppliedReportingLimit
        : reportedValue < suppliedReportingLimit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reportedValue: 5, suppliedReportingLimit: 3, higherIsAbove: true },
  output: { signedGap: 2, aboveUnderDirection: true },
} satisfies ToolExample<Input, Output>;
export const sampleReportingLimitGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-health/sample-reporting-limit-gap",
    title: "Sample Reporting Limit Gap Tool",
    description:
      "Compare supplied assay values to an explicit reporting threshold without selecting a regulatory or health limit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reportedValue: { type: "number" },
        suppliedReportingLimit: { type: "number" },
        higherIsAbove: { type: "boolean" },
      },
      required: ["reportedValue", "suppliedReportingLimit", "higherIsAbove"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedGap: { type: "number" },
        aboveUnderDirection: { type: "boolean" },
      },
      required: ["signedGap", "aboveUnderDirection"],
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
          id: "suppliedReportingLimit",
          label: "Supplied Reporting Limit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "higherIsAbove",
          label: "Higher Is Above",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
        {
          id: "aboveUnderDirection",
          label: "Above Under Direction",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = sampleReportingLimitGapTool.execute;
export default sampleReportingLimitGapTool;

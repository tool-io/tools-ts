import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly period: number;
  readonly eventPeriod: number;
  readonly referenceRelativePeriod: number;
};
export type Output = {
  readonly relativePeriod: number;
  readonly omittedReference: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    period: { type: "integer" },
    eventPeriod: { type: "integer" },
    referenceRelativePeriod: { type: "integer" },
  },
  required: ["period", "eventPeriod", "referenceRelativePeriod"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    relativePeriod: { type: "integer" },
    omittedReference: { type: "boolean" },
  },
  required: ["relativePeriod", "omittedReference"],
} as const;
/** Calculate event study relative time index term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { period, eventPeriod, referenceRelativePeriod } = request;
  const compute = (): Output => {
    return {
      relativePeriod: period - eventPeriod,
      omittedReference: period - eventPeriod === referenceRelativePeriod,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { period: 12, eventPeriod: 10, referenceRelativePeriod: -1 },
  output: { relativePeriod: 2, omittedReference: false },
} satisfies ToolExample<Input, Output>;
export const eventStudyRelativeTimeIndexTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "econometrics/event-study-relative-time-index-term",
    title: "Event Study Relative Time Index Term Tool",
    description:
      "Calculate event study relative time index term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        period: { type: "integer" },
        eventPeriod: { type: "integer" },
        referenceRelativePeriod: { type: "integer" },
      },
      required: ["period", "eventPeriod", "referenceRelativePeriod"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        relativePeriod: { type: "integer" },
        omittedReference: { type: "boolean" },
      },
      required: ["relativePeriod", "omittedReference"],
    },
    ports: {
      inputs: [
        {
          id: "period",
          label: "Period",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "eventPeriod",
          label: "Event Period",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "referenceRelativePeriod",
          label: "Reference Relative Period",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "relativePeriod",
          label: "Relative Period",
          valueType: { type: "integer" },
        },
        {
          id: "omittedReference",
          label: "Omitted Reference",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = eventStudyRelativeTimeIndexTermTool.execute;
export default eventStudyRelativeTimeIndexTermTool;

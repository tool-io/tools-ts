import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cohortPersonTime: number;
  readonly totalPersonTime: number;
  readonly excludedPersonTime: number;
};
export type Output = { readonly denominator: number; readonly share: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cohortPersonTime: { type: "number", minimum: 0 },
    totalPersonTime: { type: "number" },
    excludedPersonTime: { type: "number", minimum: 0 },
  },
  required: ["cohortPersonTime", "totalPersonTime", "excludedPersonTime"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { denominator: { type: "number" }, share: { type: "number" } },
  required: ["denominator", "share"],
} as const;
/** Share of supplied compatible cohort person-time without a population forecast. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cohortPersonTime, totalPersonTime, excludedPersonTime } = request;
  const compute = (): Output => {
    H.domain(
      totalPersonTime > excludedPersonTime &&
        excludedPersonTime >= 0 &&
        cohortPersonTime >= 0 &&
        cohortPersonTime <= totalPersonTime - excludedPersonTime,
    );
    return {
      denominator: totalPersonTime - excludedPersonTime,
      share: cohortPersonTime / (totalPersonTime - excludedPersonTime),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cohortPersonTime: 20, totalPersonTime: 100, excludedPersonTime: 20 },
  output: { denominator: 80, share: 0.25 },
} satisfies ToolExample<Input, Output>;
export const cohortAgingExposureShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "demographic-economics/cohort-aging-exposure-share",
    title: "Cohort Aging Exposure Share Tool",
    description:
      "Share of supplied compatible cohort person-time without a population forecast.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cohortPersonTime: { type: "number", minimum: 0 },
        totalPersonTime: { type: "number" },
        excludedPersonTime: { type: "number", minimum: 0 },
      },
      required: ["cohortPersonTime", "totalPersonTime", "excludedPersonTime"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "number" },
        share: { type: "number" },
      },
      required: ["denominator", "share"],
    },
    ports: {
      inputs: [
        {
          id: "cohortPersonTime",
          label: "Cohort Person Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalPersonTime",
          label: "Total Person Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedPersonTime",
          label: "Excluded Person Time",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = cohortAgingExposureShareTool.execute;
export default cohortAgingExposureShareTool;

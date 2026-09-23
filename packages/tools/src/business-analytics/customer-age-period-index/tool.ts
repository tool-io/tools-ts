import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly acquiredAt: number;
  readonly cutoff: number;
  readonly periodLength: number;
};
export type Output = { readonly age: number; readonly periodIndex: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    acquiredAt: { type: "number" },
    cutoff: { type: "number" },
    periodLength: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["acquiredAt", "cutoff", "periodLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { age: { type: "number" }, periodIndex: { type: "integer" } },
  required: ["age", "periodIndex"],
} as const;
/** Index supplied customer age by fixed-duration periods with floor rounding, retaining future acquisition flags through negative indices. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { acquiredAt, cutoff, periodLength } = request;
  const compute = (): Output => {
    H.positive(periodLength);
    return {
      age: cutoff - acquiredAt,
      periodIndex: Math.floor((cutoff - acquiredAt) / periodLength),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { acquiredAt: 10, cutoff: 35, periodLength: 10 },
  output: { age: 25, periodIndex: 2 },
} satisfies ToolExample<Input, Output>;
export const customerAgePeriodIndexTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "business-analytics/customer-age-period-index",
    title: "Customer Age Period Index Tool",
    description:
      "Index supplied customer age by fixed-duration periods with floor rounding, retaining future acquisition flags through negative indices.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        acquiredAt: { type: "number" },
        cutoff: { type: "number" },
        periodLength: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["acquiredAt", "cutoff", "periodLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { age: { type: "number" }, periodIndex: { type: "integer" } },
      required: ["age", "periodIndex"],
    },
    ports: {
      inputs: [
        {
          id: "acquiredAt",
          label: "Acquired At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cutoff",
          label: "Cutoff",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "periodLength",
          label: "Period Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "age", label: "Age", valueType: { type: "number" } },
        {
          id: "periodIndex",
          label: "Period Index",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = customerAgePeriodIndexTool.execute;
export default customerAgePeriodIndexTool;

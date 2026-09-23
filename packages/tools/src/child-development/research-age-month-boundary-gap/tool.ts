import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly ageMonths: number;
  readonly suppliedBoundaryMonths: number;
};
export type Output = { readonly gapMonths: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ageMonths: { type: "number", minimum: 0 },
    suppliedBoundaryMonths: { type: "number", minimum: 0 },
  },
  required: ["ageMonths", "suppliedBoundaryMonths"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gapMonths: { type: "number" } },
  required: ["gapMonths"],
} as const;
/** Compare supplied research age coordinates with an explicit month boundary without developmental classification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ageMonths, suppliedBoundaryMonths } = request;
  const compute = (): Output => {
    H.domain(ageMonths >= 0 && suppliedBoundaryMonths >= 0);
    return { gapMonths: ageMonths - suppliedBoundaryMonths };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { ageMonths: 18.5, suppliedBoundaryMonths: 18 },
  output: { gapMonths: 0.5 },
} satisfies ToolExample<Input, Output>;
export const researchAgeMonthBoundaryGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "child-development/research-age-month-boundary-gap",
    title: "Research Age Month Boundary Gap Tool",
    description:
      "Compare supplied research age coordinates with an explicit month boundary without developmental classification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ageMonths: { type: "number", minimum: 0 },
        suppliedBoundaryMonths: { type: "number", minimum: 0 },
      },
      required: ["ageMonths", "suppliedBoundaryMonths"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gapMonths: { type: "number" } },
      required: ["gapMonths"],
    },
    ports: {
      inputs: [
        {
          id: "ageMonths",
          label: "Age Months",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedBoundaryMonths",
          label: "Supplied Boundary Months",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "gapMonths", label: "Gap Months", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = researchAgeMonthBoundaryGapTool.execute;
export default researchAgeMonthBoundaryGapTool;

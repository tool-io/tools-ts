import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cohortIndex: number;
  readonly periodIndex: number;
};
export type Output = { readonly indexGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cohortIndex: { type: "integer" },
    periodIndex: { type: "integer" },
  },
  required: ["cohortIndex", "periodIndex"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { indexGap: { type: "integer" } },
  required: ["indexGap"],
} as const;
/** Subtract supplied research indices exactly before checking the portable integer range. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cohortIndex, periodIndex } = request;
  const compute = (): Output => {
    return { indexGap: Number(BigInt(periodIndex) - BigInt(cohortIndex)) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cohortIndex: 10, periodIndex: 15 },
  output: { indexGap: 5 },
} satisfies ToolExample<Input, Output>;
export const cohortPeriodIndexGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gerontology/cohort-period-index-gap",
    title: "Cohort Period Index Gap Tool",
    description:
      "Subtract supplied research indices exactly before checking the portable integer range.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cohortIndex: { type: "integer" },
        periodIndex: { type: "integer" },
      },
      required: ["cohortIndex", "periodIndex"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { indexGap: { type: "integer" } },
      required: ["indexGap"],
    },
    ports: {
      inputs: [
        {
          id: "cohortIndex",
          label: "Cohort Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "periodIndex",
          label: "Period Index",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "indexGap", label: "Index Gap", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = cohortPeriodIndexGapTool.execute;
export default cohortPeriodIndexGapTool;

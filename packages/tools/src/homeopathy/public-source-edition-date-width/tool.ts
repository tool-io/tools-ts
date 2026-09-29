import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly earliestYear: number;
  readonly latestYear: number;
  readonly inclusive: boolean;
};
export type Output = { readonly widthYears: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    earliestYear: { type: "integer" },
    latestYear: { type: "integer" },
    inclusive: { type: "boolean" },
  },
  required: ["earliestYear", "latestYear", "inclusive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { widthYears: { type: "integer" } },
  required: ["widthYears"],
} as const;
/** Measure supplied public-source edition date bounds without therapeutic claims. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { earliestYear, latestYear, inclusive } = request;
  const compute = (): Output => {
    H.domain(earliestYear <= latestYear);
    return { widthYears: latestYear - earliestYear + (inclusive ? 1 : 0) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { earliestYear: 1850, latestYear: 1860, inclusive: false },
  output: { widthYears: 10 },
} satisfies ToolExample<Input, Output>;
export const publicSourceEditionDateWidthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "homeopathy/public-source-edition-date-width",
    title: "Public Source Edition Date Width Tool",
    description:
      "Measure supplied public-source edition date bounds without therapeutic claims.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        earliestYear: { type: "integer" },
        latestYear: { type: "integer" },
        inclusive: { type: "boolean" },
      },
      required: ["earliestYear", "latestYear", "inclusive"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { widthYears: { type: "integer" } },
      required: ["widthYears"],
    },
    ports: {
      inputs: [
        {
          id: "earliestYear",
          label: "Earliest Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "latestYear",
          label: "Latest Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "inclusive",
          label: "Inclusive",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "widthYears",
          label: "Width Years",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = publicSourceEditionDateWidthTool.execute;
export default publicSourceEditionDateWidthTool;

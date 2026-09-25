import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly alternativePages: number;
  readonly referencePages: number;
};
export type Output = { readonly ratio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    alternativePages: { type: "integer", minimum: 0 },
    referencePages: { type: "integer", minimum: 1 },
  },
  required: ["alternativePages", "referencePages"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ratio: { type: "number" } },
  required: ["ratio"],
} as const;
/** Calculate alternative format page ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { alternativePages, referencePages } = request;
  const compute = (): Output => {
    H.integer(alternativePages, 0);
    H.integer(referencePages, 1);
    return { ratio: alternativePages / referencePages };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { alternativePages: 30, referencePages: 20 },
  output: { ratio: 1.5 },
} satisfies ToolExample<Input, Output>;
export const alternativeFormatPageRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "disability-studies/alternative-format-page-ratio",
    title: "Alternative Format Page Ratio Tool",
    description:
      "Calculate alternative format page ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        alternativePages: { type: "integer", minimum: 0 },
        referencePages: { type: "integer", minimum: 1 },
      },
      required: ["alternativePages", "referencePages"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { ratio: { type: "number" } },
      required: ["ratio"],
    },
    ports: {
      inputs: [
        {
          id: "alternativePages",
          label: "Alternative Pages",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "referencePages",
          label: "Reference Pages",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "ratio", label: "Ratio", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = alternativeFormatPageRatioTool.execute;
export default alternativeFormatPageRatioTool;

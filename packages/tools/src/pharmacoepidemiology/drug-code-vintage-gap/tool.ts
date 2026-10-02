import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordYear: number;
  readonly vocabularyYear: number;
};
export type Output = { readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordYear: { type: "integer" },
    vocabularyYear: { type: "integer" },
  },
  required: ["recordYear", "vocabularyYear"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "integer" } },
  required: ["gap"],
} as const;
/** Compare supplied deidentified vocabulary vintage years without resolving a drug code. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordYear, vocabularyYear } = request;
  const compute = (): Output => {
    return { gap: Number(BigInt(recordYear) - BigInt(vocabularyYear)) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordYear: 2024, vocabularyYear: 2020 },
  output: { gap: 4 },
} satisfies ToolExample<Input, Output>;
export const drugCodeVintageGapTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "pharmacoepidemiology/drug-code-vintage-gap",
    title: "Drug Code Vintage Gap Tool",
    description:
      "Compare supplied deidentified vocabulary vintage years without resolving a drug code.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordYear: { type: "integer" },
        vocabularyYear: { type: "integer" },
      },
      required: ["recordYear", "vocabularyYear"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gap: { type: "integer" } },
      required: ["gap"],
    },
    ports: {
      inputs: [
        {
          id: "recordYear",
          label: "Record Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "vocabularyYear",
          label: "Vocabulary Year",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "gap", label: "Gap", valueType: { type: "integer" } }],
    },
  },
  calculate,
});
export const run = drugCodeVintageGapTool.execute;
export default drugCodeVintageGapTool;

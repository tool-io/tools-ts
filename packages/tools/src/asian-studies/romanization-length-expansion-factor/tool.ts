import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly source: string; readonly romanized: string };
export type Output = {
  readonly sourceLength: number;
  readonly romanizedLength: number;
  readonly ratio: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    source: { type: "string", maxLength: 8192 },
    romanized: { type: "string", maxLength: 8192 },
  },
  required: ["source", "romanized"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceLength: { type: "integer" },
    romanizedLength: { type: "integer" },
    ratio: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["sourceLength", "romanizedLength", "ratio", "defined"],
} as const;
/** Compare supplied Unicode code-point lengths without performing romanization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { source, romanized } = request;
  const compute = (): Output => {
    return {
      sourceLength: [...source].length,
      romanizedLength: [...romanized].length,
      ratio: source.length > 0 ? [...romanized].length / [...source].length : 0,
      defined: source.length > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { source: "東京", romanized: "Tokyo" },
  output: { sourceLength: 2, romanizedLength: 5, ratio: 2.5, defined: true },
} satisfies ToolExample<Input, Output>;
export const romanizationLengthExpansionFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "asian-studies/romanization-length-expansion-factor",
    title: "Romanization Length Expansion Factor Tool",
    description:
      "Compare supplied Unicode code-point lengths without performing romanization.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        source: { type: "string", maxLength: 8192 },
        romanized: { type: "string", maxLength: 8192 },
      },
      required: ["source", "romanized"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceLength: { type: "integer" },
        romanizedLength: { type: "integer" },
        ratio: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["sourceLength", "romanizedLength", "ratio", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "romanized",
          label: "Romanized",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "sourceLength",
          label: "Source Length",
          valueType: { type: "integer" },
        },
        {
          id: "romanizedLength",
          label: "Romanized Length",
          valueType: { type: "integer" },
        },
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = romanizationLengthExpansionFactorTool.execute;
export default romanizationLengthExpansionFactorTool;

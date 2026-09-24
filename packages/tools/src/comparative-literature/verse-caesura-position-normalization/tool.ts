import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly syllables: number;
  readonly beforeCaesura: number;
};
export type Output = {
  readonly fraction: number;
  readonly afterCaesura: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    syllables: { type: "integer", minimum: 1 },
    beforeCaesura: { type: "integer", minimum: 0 },
  },
  required: ["syllables", "beforeCaesura"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fraction: { type: "number" },
    afterCaesura: { type: "integer" },
  },
  required: ["fraction", "afterCaesura"],
} as const;
/** Normalize an explicitly annotated caesura position, without inferring syllables or meter from text. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { syllables, beforeCaesura } = request;
  const compute = (): Output => {
    H.integer(syllables, 1);
    H.integer(beforeCaesura, 0, syllables);
    return {
      fraction: beforeCaesura / syllables,
      afterCaesura: syllables - beforeCaesura,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { syllables: 12, beforeCaesura: 5 },
  output: { fraction: 0.4166666666666667, afterCaesura: 7 },
} satisfies ToolExample<Input, Output>;
export const verseCaesuraPositionNormalizationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "comparative-literature/verse-caesura-position-normalization",
    title: "Verse Caesura Position Normalization Tool",
    description:
      "Normalize an explicitly annotated caesura position, without inferring syllables or meter from text.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        syllables: { type: "integer", minimum: 1 },
        beforeCaesura: { type: "integer", minimum: 0 },
      },
      required: ["syllables", "beforeCaesura"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fraction: { type: "number" },
        afterCaesura: { type: "integer" },
      },
      required: ["fraction", "afterCaesura"],
    },
    ports: {
      inputs: [
        {
          id: "syllables",
          label: "Syllables",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "beforeCaesura",
          label: "Before Caesura",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        {
          id: "afterCaesura",
          label: "After Caesura",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = verseCaesuraPositionNormalizationTool.execute;
export default verseCaesuraPositionNormalizationTool;

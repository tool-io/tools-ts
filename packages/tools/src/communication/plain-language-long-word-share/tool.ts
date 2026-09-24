import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly longWords: number; readonly totalWords: number };
export type Output = { readonly fraction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    longWords: { type: "integer", minimum: 0 },
    totalWords: { type: "integer", minimum: 1 },
  },
  required: ["longWords", "totalWords"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" } },
  required: ["fraction"],
} as const;
/** Use caller-classified long-word counts without choosing a readability definition or score. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { longWords, totalWords } = request;
  const compute = (): Output => {
    H.integer(totalWords, 1);
    H.integer(longWords, 0, totalWords);
    return { fraction: longWords / totalWords };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { longWords: 12, totalWords: 80 },
  output: { fraction: 0.15 },
} satisfies ToolExample<Input, Output>;
export const plainLanguageLongWordShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "communication/plain-language-long-word-share",
    title: "Plain Language Long Word Share Tool",
    description:
      "Use caller-classified long-word counts without choosing a readability definition or score.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        longWords: { type: "integer", minimum: 0 },
        totalWords: { type: "integer", minimum: 1 },
      },
      required: ["longWords", "totalWords"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { fraction: { type: "number" } },
      required: ["fraction"],
    },
    ports: {
      inputs: [
        {
          id: "longWords",
          label: "Long Words",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "totalWords",
          label: "Total Words",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = plainLanguageLongWordShareTool.execute;
export default plainLanguageLongWordShareTool;

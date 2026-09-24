import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstWords: number;
  readonly secondWords: number;
};
export type Output = { readonly ratio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstWords: { type: "integer", minimum: 1 },
    secondWords: { type: "integer", minimum: 0 },
  },
  required: ["firstWords", "secondWords"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ratio: { type: "number" } },
  required: ["ratio"],
} as const;
/** Calculate prose paragraph pace ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstWords, secondWords } = request;
  const compute = (): Output => {
    H.integer(firstWords, 1);
    H.integer(secondWords, 0);
    return { ratio: secondWords / firstWords };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstWords: 40, secondWords: 60 },
  output: { ratio: 1.5 },
} satisfies ToolExample<Input, Output>;
export const proseParagraphPaceRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "creative-writing/prose-paragraph-pace-ratio",
    title: "Prose Paragraph Pace Ratio Tool",
    description:
      "Calculate prose paragraph pace ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstWords: { type: "integer", minimum: 1 },
        secondWords: { type: "integer", minimum: 0 },
      },
      required: ["firstWords", "secondWords"],
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
          id: "firstWords",
          label: "First Words",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondWords",
          label: "Second Words",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "ratio", label: "Ratio", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = proseParagraphPaceRatioTool.execute;
export default proseParagraphPaceRatioTool;

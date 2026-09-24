import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceWords: number;
  readonly omittedWords: number;
};
export type Output = {
  readonly retainedWords: number;
  readonly omittedFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceWords: { type: "integer", minimum: 1 },
    omittedWords: { type: "integer", minimum: 0 },
  },
  required: ["sourceWords", "omittedWords"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    retainedWords: { type: "integer" },
    omittedFraction: { type: "number" },
  },
  required: ["retainedWords", "omittedFraction"],
} as const;
/** Calculate translation omission one passage share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceWords, omittedWords } = request;
  const compute = (): Output => {
    H.integer(sourceWords, 1);
    H.integer(omittedWords, 0, sourceWords);
    return {
      retainedWords: sourceWords - omittedWords,
      omittedFraction: omittedWords / sourceWords,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sourceWords: 200, omittedWords: 30 },
  output: { retainedWords: 170, omittedFraction: 0.15 },
} satisfies ToolExample<Input, Output>;
export const translationOmissionOnePassageShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "comparative-literature/translation-omission-one-passage-share",
    title: "Translation Omission One Passage Share Tool",
    description:
      "Calculate translation omission one passage share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceWords: { type: "integer", minimum: 1 },
        omittedWords: { type: "integer", minimum: 0 },
      },
      required: ["sourceWords", "omittedWords"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        retainedWords: { type: "integer" },
        omittedFraction: { type: "number" },
      },
      required: ["retainedWords", "omittedFraction"],
    },
    ports: {
      inputs: [
        {
          id: "sourceWords",
          label: "Source Words",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "omittedWords",
          label: "Omitted Words",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "retainedWords",
          label: "Retained Words",
          valueType: { type: "integer" },
        },
        {
          id: "omittedFraction",
          label: "Omitted Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = translationOmissionOnePassageShareTool.execute;
export default translationOmissionOnePassageShareTool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly text: string;
  readonly mapVToU: boolean;
  readonly mapIToJ: boolean;
}>;
export type Output = Readonly<{
  readonly normalizedText: string;
  readonly replacementCount: number;
}>;

export const calculate = (input: Input): Output => {
  let normalizedText = input.text;
  if (normalizedText.length === 0)
    simpleError("text", "Text must not be empty.", "empty_text");
  let replacementCount = 0;
  if (input.mapVToU)
    normalizedText = normalizedText.replace(/V/giu, (value) => {
      replacementCount += 1;
      return value === value.toLowerCase() ? "u" : "U";
    });
  if (input.mapIToJ)
    normalizedText = normalizedText.replace(/I/giu, (value) => {
      replacementCount += 1;
      return value === value.toLowerCase() ? "j" : "J";
    });
  return { normalizedText, replacementCount };
};

export const exampleInput = {
  text: "IVLIVS",
  mapVToU: true,
  mapIToJ: false,
} satisfies Input;
export const example = {
  input: exampleInput,
  output: calculate(exampleInput),
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  text: "VIVAT",
  mapVToU: true,
  mapIToJ: true,
} satisfies Input;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      text: input.text as string,
      mapVToU: input.mapVToU as boolean,
      mapIToJ: input.mapIToJ as boolean,
    }),
  description:
    "Apply caller-selected mechanical V/U and I/J transcription mappings.",
  id: "classics/inscription-letter-normalizer",
  inputs: [
    { id: "text", label: "Inscription text", kind: "string" },
    { id: "mapVToU", label: "Map V to U", kind: "boolean" },
    { id: "mapIToJ", label: "Map I to J", kind: "boolean" },
  ],
  outputs: [
    { id: "normalizedText", label: "Normalized text", kind: "string" },
    {
      id: "replacementCount",
      label: "Replacement count",
      kind: "integer",
      minimum: 0,
    },
  ],
  title: "Inscription Letter Normalizer",
});

export const run = tool.execute;
export default tool;

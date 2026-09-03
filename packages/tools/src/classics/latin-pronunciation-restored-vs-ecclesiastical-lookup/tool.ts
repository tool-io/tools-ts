import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch43-shared.js";

export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "topic", label: "Topic", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        summary:
          "Restored Classical Latin and ecclesiastical Latin differ in conventions for c, g, v, diphthongs and vowel quantity; ecclesiastical practice also varies locally.",
        reference: "Allen, Vox Latina; Latin pronunciation traditions.",
        limitations:
          "Not a single universal pronunciation or automated text-to-phoneme transcription.",
      },
      "topic",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { topic: "summary" },
  output: {
    result: {
      text: "Restored Classical Latin and ecclesiastical Latin differ in conventions for c, g, v, diphthongs and vowel quantity; ecclesiastical practice also varies locally.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/latin-pronunciation-restored-vs-ecclesiastical-lookup",
  title: "Latin Pronunciation Restored vs Ecclesiastical Lookup",
  description:
    "Offline bounded reference card: Restored Classical Latin and ecclesiastical Latin differ in conventions for c, g, v, diphthongs and vowel quantity; ecclesiastical practice also varies locally. References Allen, Vox Latina; Latin pronunciation traditions. Not a single universal pronunciation or automated text-to-phoneme transcription.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

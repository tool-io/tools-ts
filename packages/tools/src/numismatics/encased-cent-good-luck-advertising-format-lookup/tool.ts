import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch45-shared.js";
export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "topic",
    label: "Topic",
    kind: "string",
    enum: ["summary", "reference", "limitations"],
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        summary:
          "Encased cents combine a coin with an advertising/souvenir surround, often with good-luck wording.",
        reference: "Encased-coin catalogue literature.",
        limitations:
          "Advertising frame and inserted coin can differ in date; no luck efficacy, provenance or authenticity guarantee.",
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
      text: "Encased cents combine a coin with an advertising/souvenir surround, often with good-luck wording.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/encased-cent-good-luck-advertising-format-lookup",
  title: "Encased Cent Good Luck Advertising Format Lookup",
  description:
    "Bounded offline reference: Encased cents combine a coin with an advertising/souvenir surround, often with good-luck wording. Source: Encased-coin catalogue literature. Advertising frame and inserted coin can differ in date; no luck efficacy, provenance or authenticity guarantee. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

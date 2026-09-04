import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch44-shared.js";

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
        english: "Once upon a time is a conventional English opening.",
        german: "Es war einmal is a conventional German opening.",
        context:
          "Record original language, performer, collector and edition rather than infer lineage from a translated formula.",
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
  input: { topic: "english" },
  output: {
    result: { text: "Once upon a time is a conventional English opening." },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/folktale-opening-formula-variants-lookup",
  title: "Folktale Opening Formula Variants Lookup",
  description:
    "Bounded offline reference: Opening formulas establish a storytelling frame rather than a verifiable timestamp. Source: Comparative folktale formula studies; Grimm, Kinder-und Hausm\u00e4rchen. Examples are bounded, not universal translations or evidence of common origin. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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

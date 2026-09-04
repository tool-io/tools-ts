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
        summary:
          "Egyptian heart weighing appears in funerary judgment imagery, including Book of the Dead spell 125.",
        reference:
          "Egyptian Book of the Dead, spell 125; British Museum funerary papyri.",
        limitations:
          "Source-specific historical belief, not a test of morality or a universal afterlife account.",
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
      text: "Egyptian heart weighing appears in funerary judgment imagery, including Book of the Dead spell 125.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/afterlife-heart-weighing-cultures-lookup",
  title: "Afterlife Heart Weighing Cultures Lookup",
  description:
    "Bounded offline reference: Egyptian heart weighing appears in funerary judgment imagery, including Book of the Dead spell 125. Source: Egyptian Book of the Dead, spell 125; British Museum funerary papyri. Source-specific historical belief, not a test of morality or a universal afterlife account. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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

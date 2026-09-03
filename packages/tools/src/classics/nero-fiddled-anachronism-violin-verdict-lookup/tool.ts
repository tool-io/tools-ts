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
          "The modern violin postdates Nero; Nero could not literally have played a violin during the 64 CE fire.",
        reference: "Tacitus, Annals 15.38\u201339; history of the violin.",
        limitations:
          "This anachronism does not settle every ancient musical-performance or fire-responsibility allegation.",
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
      text: "The modern violin postdates Nero; Nero could not literally have played a violin during the 64 CE fire.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/nero-fiddled-anachronism-violin-verdict-lookup",
  title: "Nero Fiddled Anachronism Violin Verdict Lookup",
  description:
    "Offline bounded reference card: The modern violin postdates Nero; Nero could not literally have played a violin during the 64 CE fire. References Tacitus, Annals 15.38\u201339; history of the violin. This anachronism does not settle every ancient musical-performance or fire-responsibility allegation.",
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

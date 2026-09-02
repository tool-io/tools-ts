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
          "Valens died in the 378 CE Adrianople defeat against Gothic forces; its causes cannot be reduced to one cavalry lesson.",
        reference: "Ammianus Marcellinus 31.12\u201313.",
        limitations:
          "Sources, coordination, terrain and force estimates matter; no tactical recipe or simplistic end-of-infantry thesis.",
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
      text: "Valens died in the 378 CE Adrianople defeat against Gothic forces; its causes cannot be reduced to one cavalry lesson.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/adrianople-378-valens-gothic-cavalry-lesson-lookup",
  title: "Adrianople, 378 AD (Valens): Gothic Cavalry Lesson Lookup",
  description:
    "Bounded offline reference: Valens died in the 378 CE Adrianople defeat against Gothic forces; its causes cannot be reduced to one cavalry lesson. Source: Ammianus Marcellinus 31.12\u201313. Sources, coordination, terrain and force estimates matter; no tactical recipe or simplistic end-of-infantry thesis. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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

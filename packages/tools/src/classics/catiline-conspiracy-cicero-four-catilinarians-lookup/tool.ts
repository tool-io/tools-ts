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
          "Cicero's four Catilinarian speeches belong to the 63 BCE conspiracy context; Sallust supplies a distinct narrative.",
        reference: "Cicero, In Catilinam1\u20134; Sallust, Bellum Catilinae.",
        limitations:
          "Partisan speech is not neutral proof of every charge or reconstructed intention.",
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
      text: "Cicero's four Catilinarian speeches belong to the 63 BCE conspiracy context; Sallust supplies a distinct narrative.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/catiline-conspiracy-cicero-four-catilinarians-lookup",
  title: "Catiline Conspiracy Cicero Four Catilinarians Lookup",
  description:
    "Bounded offline reference: Cicero's four Catilinarian speeches belong to the 63 BCE conspiracy context; Sallust supplies a distinct narrative. Source: Cicero, In Catilinam1\u20134; Sallust, Bellum Catilinae. Partisan speech is not neutral proof of every charge or reconstructed intention. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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

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
        theseus: "Theseus is paired with Romulus.",
        alexander: "Alexander is paired with Caesar.",
        demosthenes: "Demosthenes is paired with Cicero.",
        lysander: "Lysander is paired with Sulla.",
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
  input: { topic: "theseus" },
  output: { result: { text: "Theseus is paired with Romulus." } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/plutarch-parallel-lives-greek-roman-pairing-scheme-lookup",
  title: "Plutarch Parallel Lives Greek Roman Pairing Scheme Lookup",
  description:
    "Bounded offline reference: Plutarch pairs Greek and Roman biographies for moral/comparative purposes. Source: Plutarch, Parallel Lives. Bounded four-pair sample, not every surviving life or a claim of identical careers. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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

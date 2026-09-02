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
          "Et tu, Brute?is familiar from Shakespeare, Julius Caesar 3.1; Suetonius, Julius82reports conflicting death accounts, including a Greek saying in one tradition.",
        reference:
          "Shakespeare, Julius Caesar 3.1; Suetonius, Divus Julius 82.",
        limitations:
          "Not a securely attested verbatim last utterance by Caesar.",
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
      text: "Et tu, Brute?is familiar from Shakespeare, Julius Caesar 3.1; Suetonius, Julius82reports conflicting death accounts, including a Greek saying in one tradition.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/et-tu-brute-suetonius-vs-shakespeare-divergence-lookup",
  title: "Et Tu Brute Suetonius vs Shakespeare Divergence Lookup",
  description:
    "Offline bounded reference card: Et tu, Brute?is familiar from Shakespeare, Julius Caesar 3.1; Suetonius, Julius82reports conflicting death accounts, including a Greek saying in one tradition. References Shakespeare, Julius Caesar 3.1; Suetonius, Divus Julius 82. Not a securely attested verbatim last utterance by Caesar.",
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

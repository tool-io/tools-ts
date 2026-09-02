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
          "Plutarch portrays Cleopatra as multilingual and notes Egyptian-language ability relative to earlier Ptolemaic practice.",
        reference: "Plutarch, Antony 27.",
        limitations:
          "A later rhetorical portrait does not prove an exhaustive verified language count or every predecessors inability.",
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
      text: "Plutarch portrays Cleopatra as multilingual and notes Egyptian-language ability relative to earlier Ptolemaic practice.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/cleopatra-polyglot-first-ptolemy-to-speak-egyptian-claim",
  title: "Cleopatra Polyglot First Ptolemy to Speak Egyptian Claim",
  description:
    "Bounded offline reference: Plutarch portrays Cleopatra as multilingual and notes Egyptian-language ability relative to earlier Ptolemaic practice. Source: Plutarch, Antony 27. A later rhetorical portrait does not prove an exhaustive verified language count or every predecessors inability. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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

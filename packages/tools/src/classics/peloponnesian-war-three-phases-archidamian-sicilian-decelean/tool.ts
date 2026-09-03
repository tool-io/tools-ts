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
          "A conventional Peloponnesian War outline distinguishes Archidamian431\u2013421 BCE, Sicilian expedition415\u2013413 BCE, and Decelean/Ionian war413\u2013404 BCE.",
        reference: "Thucydides, History; Xenophon, Hellenica.",
        limitations:
          "Peace and intervening conflicts complicate a simple three-phase model; not exact converted calendar dates.",
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
      text: "A conventional Peloponnesian War outline distinguishes Archidamian431\u2013421 BCE, Sicilian expedition415\u2013413 BCE, and Decelean/Ionian war413\u2013404 BCE.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/peloponnesian-war-three-phases-archidamian-sicilian-decelean",
  title: "Peloponnesian War Three Phases Archidamian Sicilian Decelean",
  description:
    "Bounded offline reference: A conventional Peloponnesian War outline distinguishes Archidamian431\u2013421 BCE, Sicilian expedition415\u2013413 BCE, and Decelean/Ionian war413\u2013404 BCE. Source: Thucydides, History; Xenophon, Hellenica. Peace and intervening conflicts complicate a simple three-phase model; not exact converted calendar dates. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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

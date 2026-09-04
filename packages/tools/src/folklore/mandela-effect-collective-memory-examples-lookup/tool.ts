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
          "Collective misremembering can involve shared incorrect recollections; a repeated claim is not proof of an alternate historical reality.",
        reference:
          "Loftus, memory research; French, The Psychology of Paranormal Belief.",
        limitations:
          "Verify primary records and distinguish documented observation from internet anecdotes; no diagnosis or prevalence estimate.",
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
      text: "Collective misremembering can involve shared incorrect recollections; a repeated claim is not proof of an alternate historical reality.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/mandela-effect-collective-memory-examples-lookup",
  title: "Mandela Effect Collective Memory Examples Lookup",
  description:
    "Bounded offline reference: Collective misremembering can involve shared incorrect recollections; a repeated claim is not proof of an alternate historical reality. Source: Loftus, memory research; French, The Psychology of Paranormal Belief. Verify primary records and distinguish documented observation from internet anecdotes; no diagnosis or prevalence estimate. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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

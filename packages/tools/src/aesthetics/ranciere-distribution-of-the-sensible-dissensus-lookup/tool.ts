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
          "Ranci\u00e8res distribution of the sensible concerns what can be seen, said and participated in; dissensus contests that arrangement.",
        reference: "Ranci\u00e8re, The Politics of Aesthetics.",
        limitations:
          "Not a universal formula equating disagreement with emancipatory politics.",
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
      text: "Ranci\u00e8res distribution of the sensible concerns what can be seen, said and participated in; dissensus contests that arrangement.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/ranciere-distribution-of-the-sensible-dissensus-lookup",
  title: "Ranciere Distribution of the Sensible Dissensus Lookup",
  description:
    "Bounded offline reference: Ranci\u00e8res distribution of the sensible concerns what can be seen, said and participated in; dissensus contests that arrangement. Source: Ranci\u00e8re, The Politics of Aesthetics. Not a universal formula equating disagreement with emancipatory politics. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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

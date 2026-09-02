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
          "Bourriauds relational aesthetics describes art practices centered on human relations and social exchanges.",
        reference: "Bourriaud, Relational Aesthetics 1998.",
        limitations:
          "Participation is not automatically inclusive, consensual or emancipatory.",
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
      text: "Bourriauds relational aesthetics describes art practices centered on human relations and social exchanges.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/relational-aesthetics-bourriaud-transactions-format-lookup",
  title: "Relational Aesthetics Bourriaud Transactions Format Lookup",
  description:
    "Bounded offline reference: Bourriauds relational aesthetics describes art practices centered on human relations and social exchanges. Source: Bourriaud, Relational Aesthetics 1998. Participation is not automatically inclusive, consensual or emancipatory. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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

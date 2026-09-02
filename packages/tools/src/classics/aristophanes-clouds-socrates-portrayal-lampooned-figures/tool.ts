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
          "Aristophanes Clouds satirizes a theatrical Socrates connected with several intellectual practices in a composite comic portrayal.",
        reference: "Aristophanes, Clouds; Plato, Apology18\u201319.",
        limitations:
          "Comedy is not a literal reliable biography or verbatim philosophical teaching record.",
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
      text: "Aristophanes Clouds satirizes a theatrical Socrates connected with several intellectual practices in a composite comic portrayal.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/aristophanes-clouds-socrates-portrayal-lampooned-figures",
  title: "Aristophanes Clouds Socrates Portrayal Lampooned Figures",
  description:
    "Bounded offline reference: Aristophanes Clouds satirizes a theatrical Socrates connected with several intellectual practices in a composite comic portrayal. Source: Aristophanes, Clouds; Plato, Apology18\u201319. Comedy is not a literal reliable biography or verbatim philosophical teaching record. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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

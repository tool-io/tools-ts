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
          "Platos cave allegory concerns education, appearance, knowledge and the difficult return to civic life.",
        reference: "Plato, Republic7,514a\u2013521b.",
        limitations:
          "Interpretations vary; not a scientific proof that all perceived reality is simulated.",
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
      text: "Platos cave allegory concerns education, appearance, knowledge and the difficult return to civic life.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/plato-cave-allegory-republic-book-seven-lookup",
  title: "Plato Cave Allegory Republic Book VII Lookup",
  description:
    "Bounded offline reference: Platos cave allegory concerns education, appearance, knowledge and the difficult return to civic life. Source: Plato, Republic7,514a\u2013521b. Interpretations vary; not a scientific proof that all perceived reality is simulated. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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

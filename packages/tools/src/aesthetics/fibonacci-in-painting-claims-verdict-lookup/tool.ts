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
          "A Fibonacci interpretation of a painting needs independent artist/source evidence and a predefined measurement protocol.",
        reference: "Art-historical methodology; Livio, The Golden Ratio.",
        limitations:
          "Post-hoc overlay fitting is not proof of intention, beauty or statistical significance.",
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
      text: "A Fibonacci interpretation of a painting needs independent artist/source evidence and a predefined measurement protocol.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/fibonacci-in-painting-claims-verdict-lookup",
  title: "Fibonacci in Painting Claims Verdict Lookup",
  description:
    "Bounded offline reference: A Fibonacci interpretation of a painting needs independent artist/source evidence and a predefined measurement protocol. Source: Art-historical methodology; Livio, The Golden Ratio. Post-hoc overlay fitting is not proof of intention, beauty or statistical significance. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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

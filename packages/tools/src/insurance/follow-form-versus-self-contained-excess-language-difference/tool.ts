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
          "Follow-form excess incorporates specified underlying provisions; self-contained excess supplies its own insuring terms.",
        reference: "Excess policy forms.",
        limitations:
          "Even follow-form policies have distinct exclusions/conditions; underlying payment does not automatically bind the excess carrier.",
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
      text: "Follow-form excess incorporates specified underlying provisions; self-contained excess supplies its own insuring terms.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/follow-form-versus-self-contained-excess-language-difference",
  title: "Follow Form Versus Self Contained Excess Language Difference",
  description:
    "Bounded offline reference: Follow-form excess incorporates specified underlying provisions; self-contained excess supplies its own insuring terms. Source: Excess policy forms. Even follow-form policies have distinct exclusions/conditions; underlying payment does not automatically bind the excess carrier. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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

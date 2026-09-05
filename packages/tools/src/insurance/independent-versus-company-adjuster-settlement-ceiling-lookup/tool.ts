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
          "Independent and company adjusters work under different contractual relationships, but settlement authority is separately delegated.",
        reference: "Claims-administration documentation.",
        limitations:
          "A role title does not establish a universal settlement ceiling or conflict-free representation.",
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
      text: "Independent and company adjusters work under different contractual relationships, but settlement authority is separately delegated.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/independent-versus-company-adjuster-settlement-ceiling-lookup",
  title: "Independent Versus Company Adjuster Settlement Ceiling Lookup",
  description:
    "Bounded offline reference: Independent and company adjusters work under different contractual relationships, but settlement authority is separately delegated. Source: Claims-administration documentation. A role title does not establish a universal settlement ceiling or conflict-free representation. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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

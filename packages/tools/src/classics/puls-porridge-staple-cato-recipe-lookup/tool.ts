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
          "Puls is a grain porridge term; Cato records distinct preparations including Punic puls.",
        reference: "Cato, De agri cultura85\u201386.",
        limitations:
          "Ingredients/contexts differ; no single staple for all Romans or modern safe recipe supplied.",
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
      text: "Puls is a grain porridge term; Cato records distinct preparations including Punic puls.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/puls-porridge-staple-cato-recipe-lookup",
  title: "Puls Porridge Staple Cato Recipe Lookup",
  description:
    "Bounded offline reference: Puls is a grain porridge term; Cato records distinct preparations including Punic puls. Source: Cato, De agri cultura85\u201386. Ingredients/contexts differ; no single staple for all Romans or modern safe recipe supplied. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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

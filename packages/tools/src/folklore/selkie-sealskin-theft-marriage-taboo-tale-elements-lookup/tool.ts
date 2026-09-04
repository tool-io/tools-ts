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
          "Selkie tales can involve theft/concealment of sealskin, coerced marriage and eventual return to the sea.",
        reference: "Orkney/Shetland selkie narrative collections.",
        limitations:
          "Versions differ; the narrative does not justify coercion or establish actual transformations.",
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
      text: "Selkie tales can involve theft/concealment of sealskin, coerced marriage and eventual return to the sea.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/selkie-sealskin-theft-marriage-taboo-tale-elements-lookup",
  title: "Selkie Sealskin Theft Marriage Taboo Tale Elements Lookup",
  description:
    "Bounded offline reference: Selkie tales can involve theft/concealment of sealskin, coerced marriage and eventual return to the sea. Source: Orkney/Shetland selkie narrative collections. Versions differ; the narrative does not justify coercion or establish actual transformations. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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

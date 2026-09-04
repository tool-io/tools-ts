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
          "Rosca de Reyes customs involve a hidden figurine and locally specific obligations after finding it.",
        reference:
          "Mexican D\u00eda de Reyes and Candelaria cultural interpretation.",
        limitations:
          "The figurine is not safe to bite or swallow; local traditions differ and no universal duty is inferred.",
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
      text: "Rosca de Reyes customs involve a hidden figurine and locally specific obligations after finding it.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/dia-de-reyes-rosca-cafigurine-finding-custom-lookup",
  title: "Dia De Reyes Rosca Cafigurine Finding Custom Lookup",
  description:
    "Bounded offline reference: Rosca de Reyes customs involve a hidden figurine and locally specific obligations after finding it. Source: Mexican D\u00eda de Reyes and Candelaria cultural interpretation. The figurine is not safe to bite or swallow; local traditions differ and no universal duty is inferred. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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

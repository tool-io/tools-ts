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
          "Sin-eater accounts describe a funeral custom in particular British regional sources with contested practice and transmission histories.",
        reference: "British funeral folklore scholarship.",
        limitations:
          "Historical description only, no spiritual efficacy or ritual/food-handling instructions.",
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
      text: "Sin-eater accounts describe a funeral custom in particular British regional sources with contested practice and transmission histories.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/sin-eater-funeral-bread-custom-history-lookup",
  title: "Sin Eater Funeral Bread Custom History Lookup",
  description:
    "Bounded offline reference: Sin-eater accounts describe a funeral custom in particular British regional sources with contested practice and transmission histories. Source: British funeral folklore scholarship. Historical description only, no spiritual efficacy or ritual/food-handling instructions. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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

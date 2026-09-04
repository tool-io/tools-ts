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
          "B\u00fbche de No\u00ebl is a log-shaped Christmas dessert associated with earlier Yule-log imagery and customs.",
        reference: "French culinary and Christmas-custom histories.",
        limitations:
          "No single proven direct line from every ancient fire ritual or safe recipe is asserted.",
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
      text: "B\u00fbche de No\u00ebl is a log-shaped Christmas dessert associated with earlier Yule-log imagery and customs.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/buche-de-noel-yule-log-francophone-custom-lookup",
  title: "Buche De Noel Yule Log Francophone Custom Lookup",
  description:
    "Bounded offline reference: B\u00fbche de No\u00ebl is a log-shaped Christmas dessert associated with earlier Yule-log imagery and customs. Source: French culinary and Christmas-custom histories. No single proven direct line from every ancient fire ritual or safe recipe is asserted. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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

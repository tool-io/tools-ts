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
          "Crossroads-devil blues stories circulate around musical skill and pacts; attribution to Robert Johnson is not independently proven biography.",
        reference: "Blues historical scholarship; Wald, Escaping the Delta.",
        limitations:
          "Distinguish legend, later marketing and documented musical history.",
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
      text: "Crossroads-devil blues stories circulate around musical skill and pacts; attribution to Robert Johnson is not independently proven biography.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/crossroads-devil-midnight-blues-legend-lookup",
  title: "Crossroads Devil Midnight Blues Legend Lookup",
  description:
    "Bounded offline reference: Crossroads-devil blues stories circulate around musical skill and pacts; attribution to Robert Johnson is not independently proven biography. Source: Blues historical scholarship; Wald, Escaping the Delta. Distinguish legend, later marketing and documented musical history. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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

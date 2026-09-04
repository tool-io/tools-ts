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
          "Robin Hood traditions accumulate medieval ballads, later prose, theatre and film layers with changing identities and settings.",
        reference:
          "Child, English and Scottish Popular Ballads; A Gest of Robyn Hode.",
        limitations:
          "No single proven historical Robin or uniformly original cast of characters.",
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
      text: "Robin Hood traditions accumulate medieval ballads, later prose, theatre and film layers with changing identities and settings.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/robin-hood-sherwood-legend-layered-evolution-lookup",
  title: "Robin Hood Sherwood Legend Layered Evolution Lookup",
  description:
    "Bounded offline reference: Robin Hood traditions accumulate medieval ballads, later prose, theatre and film layers with changing identities and settings. Source: Child, English and Scottish Popular Ballads; A Gest of Robyn Hode. No single proven historical Robin or uniformly original cast of characters. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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

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
          "Birds on wires have multiple behavioral explanations; pressure sensitivity does not validate a deterministic storm omen.",
        reference: "Ornithological behavior research; weather-lore studies.",
        limitations:
          "No universal weather accuracy or inference about the observed species from a wire silhouette.",
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
      text: "Birds on wires have multiple behavioral explanations; pressure sensitivity does not validate a deterministic storm omen.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/birds-on-a-wire-storm-pressure-sense-claim-checker",
  title: "Birds On a Wire Storm Pressure Sense Claim Checker",
  description:
    "Bounded offline reference: Birds on wires have multiple behavioral explanations; pressure sensitivity does not validate a deterministic storm omen. Source: Ornithological behavior research; weather-lore studies. No universal weather accuracy or inference about the observed species from a wire silhouette. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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

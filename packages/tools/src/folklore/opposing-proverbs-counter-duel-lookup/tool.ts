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
        action: "Look before you leap contrasts with He who hesitates is lost.",
        distance:
          "Absence makes the heart grow fonder contrasts with Out of sight, out of mind.",
        context:
          "Record speaker, situation and intended application before calling two sayings logically inconsistent.",
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
  input: { topic: "action" },
  output: {
    result: {
      text: "Look before you leap contrasts with He who hesitates is lost.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/opposing-proverbs-counter-duel-lookup",
  title: "Opposing Proverbs Counter Duel Lookup",
  description:
    "Bounded offline reference: Proverb traditions include apparently opposing advice used in different contexts. Source: Mieder, Proverbs:A Handbook. Contradictory wording need not mean speakers hold simultaneous contradictory beliefs. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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

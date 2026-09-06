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
          "Love tokens use engraved or modified coins for personal/sentimental expression.",
        reference: "Love-token collecting histories.",
        limitations:
          "Engraving is not proof of named ownership, date or protected provenance; valuation is contextual.",
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
      text: "Love tokens use engraved or modified coins for personal/sentimental expression.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/love-token-engraved-charm-personalization-lookup",
  title: "Love Token Engraved Charm Personalization Lookup",
  description:
    "Bounded offline reference: Love tokens use engraved or modified coins for personal/sentimental expression. Source: Love-token collecting histories. Engraving is not proof of named ownership, date or protected provenance; valuation is contextual. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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

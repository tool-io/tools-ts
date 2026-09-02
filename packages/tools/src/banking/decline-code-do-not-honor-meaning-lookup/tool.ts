import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick, unique } from "../batch45-shared.js";
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
          "Do not honor is a generic issuer decline response that does not disclose a unique underlying cause.",
        reference: "Card-network/processor response-code documentation.",
        limitations:
          "The processor/network version matters; contact the issuer through trusted channels, not repeated forced retries.",
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
      text: "Do not honor is a generic issuer decline response that does not disclose a unique underlying cause.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/decline-code-do-not-honor-meaning-lookup",
  title: "Decline Code Do Not Honor Meaning Lookup",
  description:
    "Bounded offline reference: Do not honor is a generic issuer decline response that does not disclose a unique underlying cause. Source: Card-network/processor response-code documentation. The processor/network version matters; contact the issuer through trusted channels, not repeated forced retries. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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

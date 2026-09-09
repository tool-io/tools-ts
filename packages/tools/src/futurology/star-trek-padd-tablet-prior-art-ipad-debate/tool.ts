import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch46-shared.js";
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
          "Star TrekPADDdevices are fictional handheld information interfaces often compared retrospectively with tablets.",
        reference:
          "StarTrekproduction histories and intellectual-property scholarship.",
        limitations:
          "Visual resemblance alone does not determine patent novelty, legal prior art or design causation.",
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
      text: "Star TrekPADDdevices are fictional handheld information interfaces often compared retrospectively with tablets.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "futurology/star-trek-padd-tablet-prior-art-ipad-debate",
  title: "Star Trek Padd Tablet Prior Art Ipad Debate",
  description:
    "Bounded offline reference: Star TrekPADDdevices are fictional handheld information interfaces often compared retrospectively with tablets. Source: StarTrekproduction histories and intellectual-property scholarship. Visual resemblance alone does not determine patent novelty, legal prior art or design causation. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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

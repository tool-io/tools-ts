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
          "Bretton Woods institutions were agreed in 1944; the US suspended official dollar-gold convertibility in 1971 amid a longer transition.",
        reference:
          "IMF, Bretton Woods history; Federal Reserve History, Nixon Shock.",
        limitations:
          "Not every exchange rate floated immediately in 1971 or one universal end date for all arrangements.",
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
      text: "Bretton Woods institutions were agreed in 1944; the US suspended official dollar-gold convertibility in 1971 amid a longer transition.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/bretton-woods-1944-to-nixon-shock-1971-timeline-lookup",
  title: "Bretton Woods 1944 to Nixon Shock 1971 Timeline Lookup",
  description:
    "Bounded offline reference: Bretton Woods institutions were agreed in 1944; the US suspended official dollar-gold convertibility in 1971 amid a longer transition. Source: IMF, Bretton Woods history; Federal Reserve History, Nixon Shock. Not every exchange rate floated immediately in 1971 or one universal end date for all arrangements. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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

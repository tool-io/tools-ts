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
          "The so-called Baghdad battery is an archaeological assemblage with disputed interpretation and no secure proof of ancient electroplating use.",
        reference: "Archaeological and history-of-technology scholarship.",
        limitations:
          "A modern electrical demonstration does not establish ancient function; no electrolyte/electrical construction instructions supplied.",
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
      text: "The so-called Baghdad battery is an archaeological assemblage with disputed interpretation and no secure proof of ancient electroplating use.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/baghdad-battery-electricity-claim-myth-verdict-checker",
  title: "Baghdad Battery Electricity Claim Myth Verdict Checker",
  description:
    "Bounded offline reference: The so-called Baghdad battery is an archaeological assemblage with disputed interpretation and no secure proof of ancient electroplating use. Source: Archaeological and history-of-technology scholarship. A modern electrical demonstration does not establish ancient function; no electrolyte/electrical construction instructions supplied. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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

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
          "Defrutum/sapa denote reduced grape must in ancient contexts; lead-related hypotheses depend on vessels and evidence.",
        reference:
          "Pliny, Natural History; Roman food/lead-exposure scholarship.",
        limitations:
          "No lead-vessel procedure, safe preparation or claim that one sweetener alone caused Roman decline.",
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
      text: "Defrutum/sapa denote reduced grape must in ancient contexts; lead-related hypotheses depend on vessels and evidence.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/defrutum-sapa-boiled-must-sweetener-lead-risk-debate",
  title: "Defrutum Sapa Boiled Must Sweetener Lead Risk Debate",
  description:
    "Bounded offline reference: Defrutum/sapa denote reduced grape must in ancient contexts; lead-related hypotheses depend on vessels and evidence. Source: Pliny, Natural History; Roman food/lead-exposure scholarship. No lead-vessel procedure, safe preparation or claim that one sweetener alone caused Roman decline. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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

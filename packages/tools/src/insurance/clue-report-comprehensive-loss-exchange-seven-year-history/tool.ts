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
          "CLUE consumer reports contain reported loss/claim histories under provider retention and reporting practices.",
        reference: "LexisNexis, CLUE consumer disclosure materials.",
        limitations:
          "Seven years is a contextual product convention, not proof every event is present/accurate or a universal legal retention rule.",
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
      text: "CLUE consumer reports contain reported loss/claim histories under provider retention and reporting practices.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/clue-report-comprehensive-loss-exchange-seven-year-history",
  title: "CLUE Report Comprehensive Loss Exchange Seven Year History",
  description:
    "Bounded offline reference: CLUE consumer reports contain reported loss/claim histories under provider retention and reporting practices. Source: LexisNexis, CLUE consumer disclosure materials. Seven years is a contextual product convention, not proof every event is present/accurate or a universal legal retention rule. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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

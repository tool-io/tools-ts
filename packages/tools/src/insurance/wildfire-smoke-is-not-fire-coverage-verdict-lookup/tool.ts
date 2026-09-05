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
          "Wildfire smoke may cause losses addressed under particular property terms; smoke is not fire wording does not establish a universal denial rule.",
        reference:
          "Property policy wording and state insurance regulator wildfire guidance.",
        limitations:
          "Coverage depends on damage, causation, exclusions and law; the milestones blanket verdict is not accepted.",
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
      text: "Wildfire smoke may cause losses addressed under particular property terms; smoke is not fire wording does not establish a universal denial rule.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/wildfire-smoke-is-not-fire-coverage-verdict-lookup",
  title: "Wildfire Smoke Is Not Fire Coverage Verdict Lookup",
  description:
    "Bounded offline reference: Wildfire smoke may cause losses addressed under particular property terms; smoke is not fire wording does not establish a universal denial rule. Source: Property policy wording and state insurance regulator wildfire guidance. Coverage depends on damage, causation, exclusions and law; the milestones blanket verdict is not accepted. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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

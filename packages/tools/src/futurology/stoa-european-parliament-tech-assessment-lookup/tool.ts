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
          "STOAis the European Parliaments Panel for the Future of Science and Technology, supporting science/technology assessment and policy deliberation.",
        reference: "EuropeanParliament, STOAinstitutional description.",
        limitations:
          "No current membership/project inventory or legislative authority inferred.",
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
      text: "STOAis the European Parliaments Panel for the Future of Science and Technology, supporting science/technology assessment and policy deliberation.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "futurology/stoa-european-parliament-tech-assessment-lookup",
  title: "Stoa European Parliament Tech Assessment Lookup",
  description:
    "Bounded offline reference: STOAis the European Parliaments Panel for the Future of Science and Technology, supporting science/technology assessment and policy deliberation. Source: EuropeanParliament, STOAinstitutional description. No current membership/project inventory or legislative authority inferred. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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

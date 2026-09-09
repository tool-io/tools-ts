import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch47-shared.js";
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
          "Coopers twelve-minute field-test work relates covered running distance to aerobic fitness in studied cohorts.",
        reference: "Cooper, JAMA 1968.",
        limitations:
          "Historical origin is distinct from individual validation; running distance does not guarantee a clinical VO2max.",
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
      text: "Coopers twelve-minute field-test work relates covered running distance to aerobic fitness in studied cohorts.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/cooper-twelve-minute-run-equation-origin-history-lookup",
  title: "Cooper Twelve Minute Run Equation Origin History Lookup",
  description:
    "Bounded offline reference: Coopers twelve-minute field-test work relates covered running distance to aerobic fitness in studied cohorts. Source: Cooper, JAMA 1968. Historical origin is distinct from individual validation; running distance does not guarantee a clinical VO2max. Explicit topic keys: summary, reference, limitations. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

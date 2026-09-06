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
          "Crossover success depends on individual coins, requested minimum grade and service criteria.",
        reference: "Grading-service crossover terms.",
        limitations:
          "No universal success rate fabricated; preserve actual independently audited submission cohorts and selection bias.",
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
      text: "Crossover success depends on individual coins, requested minimum grade and service criteria.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/crossover-pcgs-ngc-success-rate-notes-lookup",
  title: "Crossover Pcgs Ngc Success Rate Notes Lookup",
  description:
    "Bounded offline reference: Crossover success depends on individual coins, requested minimum grade and service criteria. Source: Grading-service crossover terms. No universal success rate fabricated; preserve actual independently audited submission cohorts and selection bias. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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

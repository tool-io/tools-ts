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
          "Running-blade performance comparisons depend on mechanics, athlete adaptation, event conditions and actual regulatory assessment.",
        reference: "Running prosthesis biomechanics/eligibility literature.",
        limitations:
          "No universal advantage/disadvantage verdict, eligibility or prosthesis recommendation.",
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
      text: "Running-blade performance comparisons depend on mechanics, athlete adaptation, event conditions and actual regulatory assessment.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/running-blade-energy-return-controversy-verdict-context",
  title: "Running Blade Energy Return Controversy Verdict Context",
  description:
    "Bounded offline reference: Running-blade performance comparisons depend on mechanics, athlete adaptation, event conditions and actual regulatory assessment. Source: Running prosthesis biomechanics/eligibility literature. No universal advantage/disadvantage verdict, eligibility or prosthesis recommendation. Explicit topic keys: summary, reference, limitations. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
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

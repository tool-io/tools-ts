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
    enum: ["0", "1", "2", "3", "4", "5", "6"],
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        "0": "No symptoms.",
        "1": "No significant disability despite symptoms; able to carry out usual duties/activities.",
        "2": "Slight disability; unable to carry out all previous activities but able to look after own affairs without assistance.",
        "3": "Moderate disability; requiring some help but able to walk without assistance.",
        "4": "Moderately severe disability; unable to walk or attend bodily needs without assistance.",
        "5": "Severe disability; bedridden, incontinent and requiring constant nursing care/attention.",
        "6": "Death recorded under the stated scale, not determined by this lookup.",
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
  input: { topic: "0" },
  output: { result: { text: "No symptoms." } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/modified-rankin-scale",
  title: "Modified Rankin Scale Calculator",
  description:
    "Bounded offline reference: ModifiedRankinScalegrades describe global functional disability within a specified clinical assessment, not a summative item questionnaire. Source: ModifiedRankinScalestandard descriptions. Definition lookup does not assign a grade, validate interview reliability or predict outcome. Explicit topic keys: 0, 1, 2, 3, 4, 5, 6. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
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

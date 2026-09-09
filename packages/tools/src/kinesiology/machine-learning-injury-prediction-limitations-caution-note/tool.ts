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
          "Injury-prediction models need external validation, calibration, prospective design and examination of leakage and confounding.",
        reference: "Sports injury machine-learning methodology.",
        limitations:
          "A model score does not establish a persons future injury, causal prevention strategy or justification to restrict participation.",
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
      text: "Injury-prediction models need external validation, calibration, prospective design and examination of leakage and confounding.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/machine-learning-injury-prediction-limitations-caution-note",
  title: "Machine Learning Injury Prediction Limitations Caution Note",
  description:
    "Bounded offline reference: Injury-prediction models need external validation, calibration, prospective design and examination of leakage and confounding. Source: Sports injury machine-learning methodology. A model score does not establish a persons future injury, causal prevention strategy or justification to restrict participation. Explicit topic keys: summary, reference, limitations. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
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

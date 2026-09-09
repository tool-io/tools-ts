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
          "Jandas upper-crossed pattern is a clinical conceptual description of hypothesized muscle-length/control relationships, not a diagnosis from posture alone.",
        reference: "Jandamovement-system literature.",
        limitations:
          "Do not infer weakness, tightness or prescribe corrective exercise without an actual qualified assessment.",
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
      text: "Jandas upper-crossed pattern is a clinical conceptual description of hypothesized muscle-length/control relationships, not a diagnosis from posture alone.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/janda-upper-crossed-syndrome-imbalance-list",
  title: "Janda Upper Crossed Syndrome Imbalance List",
  description:
    "Bounded offline reference: Jandas upper-crossed pattern is a clinical conceptual description of hypothesized muscle-length/control relationships, not a diagnosis from posture alone. Source: Jandamovement-system literature. Do not infer weakness, tightness or prescribe corrective exercise without an actual qualified assessment. Explicit topic keys: summary, reference, limitations. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
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

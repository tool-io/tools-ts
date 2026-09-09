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
          "Flexicurve/ruler kyphosis methods estimate shape from selected landmarks and curve geometry; they are not interchangeable with radiographic Cobb angles.",
        reference: "Flexicurve kyphosis validation literature.",
        limitations:
          "Protocol, landmarks, posture and calibration affect estimates; no diagnosis or surgery indication.",
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
      text: "Flexicurve/ruler kyphosis methods estimate shape from selected landmarks and curve geometry; they are not interchangeable with radiographic Cobb angles.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/kyphosis-ruler-method-angle-estimation-lookup",
  title: "Kyphosis Ruler Method Angle Estimation Lookup",
  description:
    "Bounded offline reference: Flexicurve/ruler kyphosis methods estimate shape from selected landmarks and curve geometry; they are not interchangeable with radiographic Cobb angles. Source: Flexicurve kyphosis validation literature. Protocol, landmarks, posture and calibration affect estimates; no diagnosis or surgery indication. Explicit topic keys: summary, reference, limitations. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
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

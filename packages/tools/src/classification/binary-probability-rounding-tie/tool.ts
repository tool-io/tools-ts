import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ probability: number; tiePolicy: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "probability", label: "Probability", kind: "number" },
  {
    id: "tiePolicy",
    label: "Tie policy",
    kind: "string",
    enum: ["positive", "negative"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bounded(i.probability, 0, 1);
  H.choice(i.tiePolicy, ["positive", "negative"]);
  return H.finish({
    classIndex:
      i.probability < 0.5
        ? 0
        : i.probability > 0.5
          ? 1
          : i.tiePolicy === "positive"
            ? 1
            : 0,
    tie: i.probability === 0.5,
  });
};
export const example = {
  input: { probability: 0.5, tiePolicy: "negative" },
  output: { result: { classIndex: 0, tie: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classification/binary-probability-rounding-tie",
  title: "Classification: Binary Probability Rounding Tie Tool",
  description:
    "Round one binary probability to a class using an explicit half-probability tie policy; does not infer calibration.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          classIndex: { type: "number" },
          tie: { type: "boolean" },
        },
        required: ["classIndex", "tie"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

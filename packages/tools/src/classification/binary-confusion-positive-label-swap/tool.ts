import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  truePositive: number;
  falsePositive: number;
  falseNegative: number;
  trueNegative: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "truePositive", label: "True positive", kind: "integer" },
  { id: "falsePositive", label: "False positive", kind: "integer" },
  { id: "falseNegative", label: "False negative", kind: "integer" },
  { id: "trueNegative", label: "True negative", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  Object.values(i).forEach((x) => H.int(x, 0, 1000000));
  return H.finish({
    truePositive: i.trueNegative,
    falsePositive: i.falseNegative,
    falseNegative: i.falsePositive,
    trueNegative: i.truePositive,
  });
};
export const example = {
  input: {
    truePositive: 2,
    falsePositive: 3,
    falseNegative: 4,
    trueNegative: 5,
  },
  output: {
    result: {
      truePositive: 5,
      falsePositive: 4,
      falseNegative: 3,
      trueNegative: 2,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classification/binary-confusion-positive-label-swap",
  title: "Classification: Binary Confusion Positive Label Swap Tool",
  description:
    "Swap the designated positive and negative classes in one binary confusion record, preserving actual/predicted roles.",
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
          falseNegative: { type: "number" },
          falsePositive: { type: "number" },
          trueNegative: { type: "number" },
          truePositive: { type: "number" },
        },
        required: [
          "falseNegative",
          "falsePositive",
          "trueNegative",
          "truePositive",
        ],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

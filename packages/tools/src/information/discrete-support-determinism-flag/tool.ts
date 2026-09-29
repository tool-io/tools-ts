import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ probabilities: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "probabilities", label: "Probabilities", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.probabilities.length > 0);
  i.probabilities.forEach((x) => H.bounded(x, 0, 1));
  H.check(Math.abs(i.probabilities.reduce((s, x) => s + x, 0) - 1) <= 1e-12);
  return H.finish({
    deterministic:
      i.probabilities.some((x) => x === 1) &&
      i.probabilities.every((x) => x === 0 || x === 1),
    positiveSupportSize: i.probabilities.filter((x) => x > 0).length,
  });
};
export const example = {
  input: { probabilities: [0, 1, 0] },
  output: { result: { deterministic: true, positiveSupportSize: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "information/discrete-support-determinism-flag",
  title: "Information: Discrete Support Determinism Flag Tool",
  description:
    "Inspect exact determinism of a normalized finite probability vector without treating small nonzero masses as zero.",
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
          deterministic: { type: "boolean" },
          positiveSupportSize: { type: "number" },
        },
        required: ["deterministic", "positiveSupportSize"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

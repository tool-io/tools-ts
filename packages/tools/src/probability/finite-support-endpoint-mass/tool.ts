import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  support: readonly number[];
  probabilities: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "support", label: "Support", kind: "numberList" },
  { id: "probabilities", label: "Probabilities", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    i.support.length > 0 &&
      i.support.length === i.probabilities.length &&
      i.support.every((x, j) => j === 0 || x > i.support[j - 1]),
  );
  i.probabilities.forEach((p) => H.bounded(p, 0, 1));
  H.check(Math.abs(i.probabilities.reduce((s, p) => s + p, 0) - 1) <= 1e-12);
  return H.finish({
    lowerEndpoint: i.support[0],
    upperEndpoint: i.support[i.support.length - 1],
    lowerMass: i.probabilities[0],
    upperMass: i.probabilities[i.probabilities.length - 1],
  });
};
export const example = {
  input: { support: [1, 2, 4], probabilities: [0.2, 0.3, 0.5] },
  output: {
    result: {
      lowerEndpoint: 1,
      upperEndpoint: 4,
      lowerMass: 0.2,
      upperMass: 0.5,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "probability/finite-support-endpoint-mass",
  title: "Probability: Finite Support Endpoint Mass Tool",
  description:
    "Extract endpoint atoms from an explicitly sorted finite probability distribution; duplicate/unsorted support and nonnormalized masses are rejected.",
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
          lowerEndpoint: { type: "number" },
          lowerMass: { type: "number" },
          upperEndpoint: { type: "number" },
          upperMass: { type: "number" },
        },
        required: ["lowerEndpoint", "lowerMass", "upperEndpoint", "upperMass"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

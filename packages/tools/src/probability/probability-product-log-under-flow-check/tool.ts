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
  i.probabilities.forEach((p) => H.bounded(p, 0, 1));
  const zeroFactor = i.probabilities.includes(0),
    logProduct = zeroFactor
      ? 0
      : i.probabilities.reduce((s, p) => s + Math.log(p), 0),
    product = Math.exp(logProduct);
  return H.finish({
    zeroFactor,
    logProduct: zeroFactor ? 0 : logProduct,
    product: zeroFactor ? 0 : product,
    underflow: !zeroFactor && product === 0,
  });
};
export const example = {
  input: { probabilities: [1e-200, 1e-200] },
  output: {
    result: {
      zeroFactor: false,
      logProduct: -921.0340371976183,
      product: 0,
      underflow: true,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "probability/probability-product-log-under-flow-check",
  title: "Probability: Probability Product Log Under Flow Check Tool",
  description:
    "Multiply supplied probabilities through log space and distinguish true zero factors from floating-point underflow; logProduct zero is unused when zeroFactor=true.",
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
          logProduct: { type: "number" },
          product: { type: "number" },
          underflow: { type: "boolean" },
          zeroFactor: { type: "boolean" },
        },
        required: ["logProduct", "product", "underflow", "zeroFactor"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  sum,
} from "../batch53-shared.js";

export type Input = Readonly<{ locusLikelihoodRatios: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "locusLikelihoodRatios",
    label: "Locus likelihood ratios",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (!i.locusLikelihoodRatios.length)
    simpleError("loci", "Explicit locus ratios required.");
  i.locusLikelihoodRatios.forEach((v) => positive(v, "LR"));
  const log10Cpi = sum(i.locusLikelihoodRatios.map(Math.log10));
  return {
    log10Cpi,
    cpi: 10 ** log10Cpi,
    assumption: "conditional-locus-independence",
    paternityEstablished: false,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { locusLikelihoodRatios: [2, 5] },
  output: {
    result: {
      log10Cpi: 1,
      cpi: 10,
      assumption: "conditional-locus-independence",
      paternityEstablished: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/paternity-cpi-multiplier-aggregator",
  title: "Paternity Combined Paternity Index CPI Multiplication Aggregator",
  description:
    "Multiply supplied locus paternity likelihood ratios through log space under explicit independence; no prior probability or identity conclusion.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;

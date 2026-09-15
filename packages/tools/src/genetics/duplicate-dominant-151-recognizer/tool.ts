import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
  positive,
  angle,
  sum,
} from "../batch53-shared.js";

export type Input = Readonly<{
  observedCounts: readonly number[];
  maximumAbsoluteFractionDeviation: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "observedCounts", label: "Observed counts", kind: "numberList" },
  {
    id: "maximumAbsoluteFractionDeviation",
    label: "Maximum absolute fraction deviation",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const ratios = [15, 1];
  if (i.observedCounts.length !== ratios.length)
    simpleError("counts", "Ordered phenotype categories required.");
  i.observedCounts.forEach((v) => bounded(v, "count", 0, 1e9));
  angle(i.maximumAbsoluteFractionDeviation, "tolerance", 0, 1);
  const total = positive(sum(i.observedCounts), "total"),
    r = sum(ratios),
    deviations = i.observedCounts.map((v, j) => v / total - ratios[j] / r);
  return {
    expectedRatio: ratios,
    signedFractionDeviations: deviations,
    withinSuppliedTolerance: deviations.every(
      (v) => Math.abs(v) <= i.maximumAbsoluteFractionDeviation,
    ),
    mechanismEstablished: false,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { observedCounts: [15, 1], maximumAbsoluteFractionDeviation: 0 },
  output: {
    result: {
      expectedRatio: [15, 1],
      signedFractionDeviations: [0, 0],
      withinSuppliedTolerance: true,
      mechanismEstablished: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/duplicate-dominant-151-recognizer",
  title: "Duplicate Dominant 15:1 Ratio Recognizer",
  description:
    "Screen ordered phenotype proportions against the named genetic ratio with caller absolute fraction tolerance; not a significance test or proof of an epistatic mechanism.",
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

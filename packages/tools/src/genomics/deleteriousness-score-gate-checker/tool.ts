import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch53-shared.js";

export type Input = Readonly<{ score: number; callerThreshold: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "score", label: "Score", kind: "number" },
  { id: "callerThreshold", label: "Caller threshold", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  return {
    signedMargin: i.score - i.callerThreshold,
    atOrAboveThreshold: i.score >= i.callerThreshold,
    pathogenicityEstablished: false,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { score: 20, callerThreshold: 15 },
  output: {
    result: {
      signedMargin: 5,
      atOrAboveThreshold: true,
      pathogenicityEstablished: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genomics/deleteriousness-score-gate-checker",
  title: "CADD-like Combined Deleteriousness Score Threshold Gate Checker",
  description:
    "Screen a caller-supplied CADD-like score and threshold; does not calculate CADD or infer pathogenicity.",
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

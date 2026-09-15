import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
  mean,
} from "../batch53-shared.js";

export type Input = Readonly<{
  depths: readonly number[];
  minimumDepth: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "depths", label: "Depths", kind: "numberList" },
  { id: "minimumDepth", label: "Minimum depth", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  bounded(i.minimumDepth, "minimum", 1, 1e9);
  if (!i.depths.length) simpleError("depths", "Per-base observations.");
  i.depths.forEach((v) => bounded(v, "depth", 0, 1e9));
  return {
    coveredBaseCount: i.depths.filter((v) => v >= i.minimumDepth).length,
    coveredPercent:
      (100 * i.depths.filter((v) => v >= i.minimumDepth).length) /
      i.depths.length,
    meanDepth: mean(i.depths),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { depths: [0, 10, 20, 30], minimumDepth: 10 },
  output: {
    result: { coveredBaseCount: 3, coveredPercent: 75, meanDepth: 15 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/consensus-coverage-depth-percent-calculator",
  title: "Consensus Sequence Coverage Percent Depth Calculator",
  description:
    "Summarize supplied per-base consensus depth and coverage threshold; does not align reads or generate a consensus sequence.",
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

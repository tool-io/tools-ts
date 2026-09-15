import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch53-shared.js";

export type Input = Readonly<{ standardCurveSlope: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "standardCurveSlope", label: "Standard curve slope", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (i.standardCurveSlope >= 0)
    simpleError("slope", "Negative slope required.");
  const efficiencyPercent = 100 * (10 ** (-1 / i.standardCurveSlope) - 1);
  return {
    efficiencyPercent,
    in90110Window: efficiencyPercent >= 90 && efficiencyPercent <= 110,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { standardCurveSlope: -3.321928094887362 },
  output: { result: { efficiencyPercent: 100, in90110Window: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/pcr-efficiency-standardcurve-slope-checker",
  title: "PCR Efficiency 90-110 Percent Standard Curve Slope Checker",
  description:
    "Compute PCR standard-curve efficiency E=(10^(−1/slope)−1)*100 and screen the educational 90–110 percent window; no assay validity guarantee.",
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

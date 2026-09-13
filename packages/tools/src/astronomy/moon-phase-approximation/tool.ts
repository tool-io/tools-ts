import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch51-shared.js";
export type Input = Readonly<{ readonly actualJulianDayUtc: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualJulianDayUtc", label: "Actual julian day utc", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const age =
    (((input.actualJulianDayUtc - 2451550.1) % 29.530588853) + 29.530588853) %
    29.530588853;
  return { meanSynodicAgeDays: age, meanCycleFraction: age / 29.530588853 };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualJulianDayUtc: 2451550.1 },
  output: { result: { meanSynodicAgeDays: 0, meanCycleFraction: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/moon-phase-approximation",
  title: "Moon Phase Approximation Calculator",
  description:
    "Meanconstant29.530588853daysynodiccyclefromdeclaredJD2451550.1approxnewmoonanchor,NOT elongation-derivedage/trueeclipse/ephemeriscalculation. Actual independent model/unit/frame/epoch/calibration and applicable measurement established;not precise ephemeris,forecast,geodesy operation,identity or safety approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;

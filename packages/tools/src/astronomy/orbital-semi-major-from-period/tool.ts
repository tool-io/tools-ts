import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualCentralGravitationalParameter: number;
  readonly actualOrbitalPeriodSeconds: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualCentralGravitationalParameter",
    label: "Actual central gravitational parameter",
    kind: "number",
  },
  {
    id: "actualOrbitalPeriodSeconds",
    label: "Actual orbital period seconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  positive(
    input.actualCentralGravitationalParameter,
    "actualCentralGravitationalParameter",
  );
  positive(input.actualOrbitalPeriodSeconds, "actualOrbitalPeriodSeconds");
  return {
    value: Math.cbrt(
      (input.actualCentralGravitationalParameter *
        input.actualOrbitalPeriodSeconds ** 2) /
        (4 * Math.PI ** 2),
    ),
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualCentralGravitationalParameter: 1,
    actualOrbitalPeriodSeconds: 6.283185307179586,
  },
  output: { result: { value: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/orbital-semi-major-from-period",
  title: "Semi-Major Axis From Period Calculator",
  description:
    "Inverseidealpointmasstwo-bodyKeplerperiodsemi-majoraxis,central\u03bcincludesactualtotalmass whenapplicable,not keplerperioddirection. Actual independent model/unit/frame/epoch/calibration and applicable measurement established;not precise ephemeris,forecast,geodesy operation,identity or safety approval.",
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

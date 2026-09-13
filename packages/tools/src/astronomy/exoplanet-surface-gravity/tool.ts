import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualExoplanetMassKg: number;
  readonly actualExoplanetRadiusMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualExoplanetMassKg",
    label: "Actual exoplanet mass kg",
    kind: "number",
  },
  {
    id: "actualExoplanetRadiusMeters",
    label: "Actual exoplanet radius meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualExoplanetMassKg, "actualExoplanetMassKg");
  positive(input.actualExoplanetRadiusMeters, "actualExoplanetRadiusMeters");
  return {
    value:
      (6.6743e-11 * input.actualExoplanetMassKg) /
      input.actualExoplanetRadiusMeters ** 2,
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
  input: { actualExoplanetMassKg: 1, actualExoplanetRadiusMeters: 1 },
  output: { result: { value: 6.6743e-11 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/exoplanet-surface-gravity",
  title: "Exoplanet Surface Gravity Calculator",
  description:
    "ActualidealNewtoniansphericalplanetgm/r\u00b2m/s\u00b2,not tablelookup/spin/effectiveatmosphericpressure or mass/radiusrelation. Actual independent model/unit/frame/epoch/calibration and applicable measurement established;not precise ephemeris,forecast,geodesy operation,identity or safety approval.",
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

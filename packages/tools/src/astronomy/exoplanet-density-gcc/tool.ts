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
  readonly actualExoplanetMassGrams: number;
  readonly actualExoplanetRadiusCentimeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualExoplanetMassGrams",
    label: "Actual exoplanet mass grams",
    kind: "number",
  },
  {
    id: "actualExoplanetRadiusCentimeters",
    label: "Actual exoplanet radius centimeters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualExoplanetMassGrams, "actualExoplanetMassGrams");
  positive(
    input.actualExoplanetRadiusCentimeters,
    "actualExoplanetRadiusCentimeters",
  );
  return {
    value:
      input.actualExoplanetMassGrams /
      (((4 * Math.PI) / 3) * input.actualExoplanetRadiusCentimeters ** 3),
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
  input: { actualExoplanetMassGrams: 1, actualExoplanetRadiusCentimeters: 1 },
  output: { result: { value: 0.23873241463784303 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/exoplanet-density-gcc",
  title: "Exoplanet Density g/cm\u00b3 Calculator",
  description:
    "Idealbulkplanetmean densityg/cm\u00b3spherefromactualmass/radius,not SI radius conversionor inferred composition. Actual independent model/unit/frame/epoch/calibration and applicable measurement established;not precise ephemeris,forecast,geodesy operation,identity or safety approval.",
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

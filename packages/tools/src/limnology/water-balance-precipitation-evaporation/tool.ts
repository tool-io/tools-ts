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
  readonly actualPeriodPrecipitationDepthMeters: number;
  readonly actualPeriodEvaporationDepthMeters: number;
  readonly actualMatchedLakeSurfaceAreaM2: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualPeriodPrecipitationDepthMeters",
    label: "Actual period precipitation depth meters",
    kind: "number",
  },
  {
    id: "actualPeriodEvaporationDepthMeters",
    label: "Actual period evaporation depth meters",
    kind: "number",
  },
  {
    id: "actualMatchedLakeSurfaceAreaM2",
    label: "Actual matched lake surface area m2",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualPeriodPrecipitationDepthMeters,
    "actualPeriodPrecipitationDepthMeters",
  );
  nonnegative(
    input.actualPeriodEvaporationDepthMeters,
    "actualPeriodEvaporationDepthMeters",
  );
  positive(
    input.actualMatchedLakeSurfaceAreaM2,
    "actualMatchedLakeSurfaceAreaM2",
  );
  return {
    value:
      (input.actualPeriodPrecipitationDepthMeters -
        input.actualPeriodEvaporationDepthMeters) *
      input.actualMatchedLakeSurfaceAreaM2,
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
    actualPeriodPrecipitationDepthMeters: 1,
    actualPeriodEvaporationDepthMeters: 2,
    actualMatchedLakeSurfaceAreaM2: 10,
  },
  output: { result: { value: -10 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/water-balance-precipitation-evaporation",
  title: "Water Balance Precipitation Evaporation Calculator",
  description:
    "ActualdirectlakeP\u2212Ewatervolumecontributiononly,not allcatchmentinflows/seepageor complete balance. Actual independent model/unit/frame/epoch/calibration and applicable measurement established;not precise ephemeris,forecast,geodesy operation,identity or safety approval.",
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

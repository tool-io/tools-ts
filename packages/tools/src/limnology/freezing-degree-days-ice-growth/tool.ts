import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualInitialClearIceThicknessMeters: number;
  readonly callerIndependentStefanGrowthCoefficientSquareMetersPerDegreeDay: number;
  readonly actualAccumulatedFreezingDegreeDays: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualInitialClearIceThicknessMeters",
    label: "Actual initial clear ice thickness meters",
    kind: "number",
  },
  {
    id: "callerIndependentStefanGrowthCoefficientSquareMetersPerDegreeDay",
    label:
      "Caller independent stefan growth coefficient square meters per degree day",
    kind: "number",
  },
  {
    id: "actualAccumulatedFreezingDegreeDays",
    label: "Actual accumulated freezing degree days",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualInitialClearIceThicknessMeters,
    "actualInitialClearIceThicknessMeters",
  );
  nonnegative(
    input.callerIndependentStefanGrowthCoefficientSquareMetersPerDegreeDay,
    "callerIndependentStefanGrowthCoefficientSquareMetersPerDegreeDay",
  );
  nonnegative(
    input.actualAccumulatedFreezingDegreeDays,
    "actualAccumulatedFreezingDegreeDays",
  );
  return {
    value: Math.sqrt(
      input.actualInitialClearIceThicknessMeters ** 2 +
        input.callerIndependentStefanGrowthCoefficientSquareMetersPerDegreeDay *
          input.actualAccumulatedFreezingDegreeDays,
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
    actualInitialClearIceThicknessMeters: 0,
    callerIndependentStefanGrowthCoefficientSquareMetersPerDegreeDay: 1,
    actualAccumulatedFreezingDegreeDays: 4,
  },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/freezing-degree-days-ice-growth",
  title: "Freezing Degree Days Ice Growth Calculator",
  description:
    "QualifiedcleariceStefanH\u00b2=H0\u00b2+C\u00d7FDD growthonly,independentC,no snow/whiteice/current/cracksor safeice travel prediction. Actual independent model/unit/frame/epoch/calibration and applicable measurement established;not precise ephemeris,forecast,geodesy operation,identity or safety approval.",
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

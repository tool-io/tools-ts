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
  readonly actualAirDensityKgPerM3: number;
  readonly actualWindSpeedMps: number;
  readonly actualProjectedFlagAreaM2: number;
  readonly callerIndependentApplicableDragCoefficient: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualAirDensityKgPerM3",
    label: "Actual air density kg per m3",
    kind: "number",
  },
  { id: "actualWindSpeedMps", label: "Actual wind speed mps", kind: "number" },
  {
    id: "actualProjectedFlagAreaM2",
    label: "Actual projected flag area m2",
    kind: "number",
  },
  {
    id: "callerIndependentApplicableDragCoefficient",
    label: "Caller independent applicable drag coefficient",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  positive(input.actualAirDensityKgPerM3, "actualAirDensityKgPerM3");
  nonnegative(input.actualWindSpeedMps, "actualWindSpeedMps");
  nonnegative(input.actualProjectedFlagAreaM2, "actualProjectedFlagAreaM2");
  nonnegative(
    input.callerIndependentApplicableDragCoefficient,
    "callerIndependentApplicableDragCoefficient",
  );
  return {
    value:
      0.5 *
      input.actualAirDensityKgPerM3 *
      input.actualWindSpeedMps ** 2 *
      input.actualProjectedFlagAreaM2 *
      input.callerIndependentApplicableDragCoefficient,
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
    actualAirDensityKgPerM3: 1,
    actualWindSpeedMps: 2,
    actualProjectedFlagAreaM2: 1,
    callerIndependentApplicableDragCoefficient: 1,
  },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/wind-load-flag-area",
  title: "Wind Load on Flag Area Calculator",
  description:
    "Restrictedquasisteadyrigid-equivalentdrag.5\u03c1U\u00b2CdA,flagfluttergusts/pole/leverage omitted,no safe poleloadcertification. Actual independently applicable flag/cloth/manufacturer/jurisdiction/protocol/sourceedition,units/calibration and observations external;not legal/display precedence,authenticity,visibility or structural safety approval.",
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

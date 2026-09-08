import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualPumpRotationalSpeedRadiansPerSecond: number;
  readonly actualPumpDischargeCubicMetersPerSecond: number;
  readonly actualPumpHeadMeters: number;
  readonly callerApplicableGravityMetersPerSecondSquared: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualPumpRotationalSpeedRadiansPerSecond",
    label: "Actual pump rotational speed radians per second",
    kind: "number",
  },
  {
    id: "actualPumpDischargeCubicMetersPerSecond",
    label: "Actual pump discharge cubic meters per second",
    kind: "number",
  },
  {
    id: "actualPumpHeadMeters",
    label: "Actual pump head meters",
    kind: "number",
  },
  {
    id: "callerApplicableGravityMetersPerSecondSquared",
    label: "Caller applicable gravity meters per second squared",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.actualPumpRotationalSpeedRadiansPerSecond, "omega");
  nonnegative(input.actualPumpDischargeCubicMetersPerSecond, "Q");
  positive(input.actualPumpHeadMeters, "H");
  positive(input.callerApplicableGravityMetersPerSecondSquared, "g");
  return {
    conditionalDimensionlessPumpSpecificSpeed:
      (input.actualPumpRotationalSpeedRadiansPerSecond *
        Math.sqrt(input.actualPumpDischargeCubicMetersPerSecond)) /
      (input.callerApplicableGravityMetersPerSecondSquared *
        input.actualPumpHeadMeters) **
        0.75,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualPumpRotationalSpeedRadiansPerSecond: 2,
    actualPumpDischargeCubicMetersPerSecond: 4,
    actualPumpHeadMeters: 1,
    callerApplicableGravityMetersPerSecondSquared: 1,
  },
  output: { result: { conditionalDimensionlessPumpSpecificSpeed: 4 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/pump-specific-speed",
  title: "Pump Specific Speed Calculator",
  description:
    "Explicit dimensionless pumpspecific speed\u03c9\u221aQ/(gH)^3/4, radians/second, SIQ/head/gravity. Not rpmmetric/US specific speed or a performance/selection guarantee.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

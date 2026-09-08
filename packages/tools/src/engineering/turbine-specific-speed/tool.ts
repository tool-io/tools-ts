import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualTurbineRotationalSpeedRadiansPerSecond: number;
  readonly actualTurbinePowerWatts: number;
  readonly callerMatchedFluidDensityKgPerCubicMeter: number;
  readonly actualTurbineHeadMeters: number;
  readonly callerApplicableGravityMetersPerSecondSquared: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualTurbineRotationalSpeedRadiansPerSecond",
    label: "Actual turbine rotational speed radians per second",
    kind: "number",
  },
  {
    id: "actualTurbinePowerWatts",
    label: "Actual turbine power watts",
    kind: "number",
  },
  {
    id: "callerMatchedFluidDensityKgPerCubicMeter",
    label: "Caller matched fluid density kg per cubic meter",
    kind: "number",
  },
  {
    id: "actualTurbineHeadMeters",
    label: "Actual turbine head meters",
    kind: "number",
  },
  {
    id: "callerApplicableGravityMetersPerSecondSquared",
    label: "Caller applicable gravity meters per second squared",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.actualTurbineRotationalSpeedRadiansPerSecond, "omega");
  nonnegative(input.actualTurbinePowerWatts, "P");
  positive(input.callerMatchedFluidDensityKgPerCubicMeter, "rho");
  positive(input.actualTurbineHeadMeters, "H");
  positive(input.callerApplicableGravityMetersPerSecondSquared, "g");
  return {
    conditionalDimensionlessTurbineSpecificSpeed:
      (input.actualTurbineRotationalSpeedRadiansPerSecond *
        Math.sqrt(
          input.actualTurbinePowerWatts /
            input.callerMatchedFluidDensityKgPerCubicMeter,
        )) /
      (input.callerApplicableGravityMetersPerSecondSquared *
        input.actualTurbineHeadMeters) **
        1.25,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualTurbineRotationalSpeedRadiansPerSecond: 2,
    actualTurbinePowerWatts: 4,
    callerMatchedFluidDensityKgPerCubicMeter: 1,
    actualTurbineHeadMeters: 1,
    callerApplicableGravityMetersPerSecondSquared: 1,
  },
  output: { result: { conditionalDimensionlessTurbineSpecificSpeed: 4 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/turbine-specific-speed",
  title: "Turbine Specific Speed Calculator",
  description:
    "Explicit dimensionless power-based turbinespecific speed\u03c9\u221a(P/\u03c1)/(gH)^5/4, SI, radians/s. Actual shaft/hydraulicpower convention independently stated; not pumpQformula or empirical rpmkWclassification.",
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

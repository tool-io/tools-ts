import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly callerCalibratedTriangularWeirDischargeCoefficient: number;
  readonly callerGravityMetersPerSecondSquared: number;
  readonly actualNotchAngleRadians: number;
  readonly actualHeadAboveNotchMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerCalibratedTriangularWeirDischargeCoefficient",
    label: "Caller calibrated triangular weir discharge coefficient",
    kind: "number",
  },
  {
    id: "callerGravityMetersPerSecondSquared",
    label: "Caller gravity meters per second squared",
    kind: "number",
  },
  {
    id: "actualNotchAngleRadians",
    label: "Actual notch angle radians",
    kind: "number",
  },
  {
    id: "actualHeadAboveNotchMeters",
    label: "Actual head above notch meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(
    input.callerCalibratedTriangularWeirDischargeCoefficient,
    "callerCalibratedTriangularWeirDischargeCoefficient",
  );
  positive(
    input.callerGravityMetersPerSecondSquared,
    "callerGravityMetersPerSecondSquared",
  );
  positive(input.actualNotchAngleRadians, "actualNotchAngleRadians");
  nonnegative(input.actualHeadAboveNotchMeters, "actualHeadAboveNotchMeters");
  if (input.actualNotchAngleRadians >= Math.PI) simpleError("angle", "0<θ<π.");
  return {
    value:
      (8 / 15) *
      input.callerCalibratedTriangularWeirDischargeCoefficient *
      Math.sqrt(2 * input.callerGravityMetersPerSecondSquared) *
      Math.tan(input.actualNotchAngleRadians / 2) *
      input.actualHeadAboveNotchMeters ** 2.5,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerCalibratedTriangularWeirDischargeCoefficient: 1,
    callerGravityMetersPerSecondSquared: 2,
    actualNotchAngleRadians: 1.5707963267948966,
    actualHeadAboveNotchMeters: 1,
  },
  output: { result: { value: 1.0666666666666667 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/weir-flow-triangular",
  title: "Plumbing Weir Flow Triangular Calculator",
  description:
    "Free-discharge sharpVnotch Q=(8/15) Cd\u221a2g tan(\u03b8/2) h^2.5, no submerged flow/surface tension correction; actual independently calibratedCdand0<\u03b8<\u03c0. Actual independently matched units, regime, material/equipment and governing references; not a hydraulic code, safe pressure, water pot ability or operational approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

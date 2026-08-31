import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly cartMassKg: number;
  readonly callerGravityMPerS2: number;
  readonly travelSignedSlopeDegrees: number;
  readonly callerRollingResistanceCoefficient: number;
}>;
export type Output = Readonly<{
  readonly signedGravityAlongTravelForceN: number;
  readonly modelRollingResistanceMagnitudeN: number;
  readonly signedRequiredSteadyTravelForceN: number;
  readonly modelCoastingOrBrakingForceNeeded: boolean;
}>;
const inputFields = [
  { id: "cartMassKg", label: "Cart mass kg", kind: "number" },
  {
    id: "callerGravityMPerS2",
    label: "Caller gravity m per s2",
    kind: "number",
  },
  {
    id: "travelSignedSlopeDegrees",
    label: "Travel signed slope degrees",
    kind: "number",
  },
  {
    id: "callerRollingResistanceCoefficient",
    label: "Caller rolling resistance coefficient",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerGravityMPerS2, "callerGravityMPerS2");
  nonnegative(input.cartMassKg, "cartMassKg");
  nonnegative(
    input.callerRollingResistanceCoefficient,
    "callerRollingResistanceCoefficient",
  );
  if (Math.abs(input.travelSignedSlopeDegrees) >= 90)
    simpleError("slope", "Signed slope strictly inside (−90,90) required.");
  const a = (input.travelSignedSlopeDegrees * Math.PI) / 180,
    w = input.cartMassKg * input.callerGravityMPerS2,
    g = w * Math.sin(a),
    r = w * Math.cos(a) * input.callerRollingResistanceCoefficient,
    f = g + r;
  return {
    signedGravityAlongTravelForceN: g,
    modelRollingResistanceMagnitudeN: r,
    signedRequiredSteadyTravelForceN: f,
    modelCoastingOrBrakingForceNeeded: f < 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  cartMassKg: 10,
  callerGravityMPerS2: 10,
  travelSignedSlopeDegrees: 30,
  callerRollingResistanceCoefficient: 0.1,
} satisfies Input;
export const exampleOutput = {
  signedGravityAlongTravelForceN: 50,
  modelRollingResistanceMagnitudeN: 8.660254037844386,
  signedRequiredSteadyTravelForceN: 58.66025403784438,
  modelCoastingOrBrakingForceNeeded: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/floor-slope-rolling-resistance",
  title: "Floor Slope Ramp Rolling Resistance Increase Calculator",
  description:
    "Model signed steady ramp travel force as gravity plus caller rolling resistance, retaining downhill coasting/braking sign; not generic grade conversion, start force, traction or ramp-safety approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedGravityAlongTravelForceN",
      label: "Signed gravity along travel force n",
      kind: "number",
    },
    {
      id: "modelRollingResistanceMagnitudeN",
      label: "Model rolling resistance magnitude n",
      kind: "number",
    },
    {
      id: "signedRequiredSteadyTravelForceN",
      label: "Signed required steady travel force n",
      kind: "number",
    },
    {
      id: "modelCoastingOrBrakingForceNeeded",
      label: "Model coasting or braking force needed",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      cartMassKg: value.cartMassKg as number,
      callerGravityMPerS2: value.callerGravityMPerS2 as number,
      travelSignedSlopeDegrees: value.travelSignedSlopeDegrees as number,
      callerRollingResistanceCoefficient:
        value.callerRollingResistanceCoefficient as number,
    }),
});
export const run = tool.execute;
export default tool;

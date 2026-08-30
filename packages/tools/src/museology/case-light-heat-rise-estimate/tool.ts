import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly internalDissipatedLightWatts: number;
  readonly caseThermalConductanceWattsPerK: number;
  readonly caseEffectiveHeatCapacityJoulesPerK: number;
  readonly lightOnSeconds: number;
  readonly initialCaseMinusRoomTemperatureC: number;
}>;
export type Output = Readonly<{
  readonly modelCaseTemperatureRiseC: number;
  readonly modelSteadyCaseTemperatureRiseC: number;
}>;
const inputFields = [
  {
    id: "internalDissipatedLightWatts",
    label: "Internal dissipated light watts",
    kind: "number",
  },
  {
    id: "caseThermalConductanceWattsPerK",
    label: "Case thermal conductance watts per k",
    kind: "number",
  },
  {
    id: "caseEffectiveHeatCapacityJoulesPerK",
    label: "Case effective heat capacity joules per k",
    kind: "number",
  },
  { id: "lightOnSeconds", label: "Light on seconds", kind: "number" },
  {
    id: "initialCaseMinusRoomTemperatureC",
    label: "Initial case minus room temperature c",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.caseThermalConductanceWattsPerK,
    "caseThermalConductanceWattsPerK",
  );
  positive(
    input.caseEffectiveHeatCapacityJoulesPerK,
    "caseEffectiveHeatCapacityJoulesPerK",
  );
  nonnegative(
    input.internalDissipatedLightWatts,
    "internalDissipatedLightWatts",
  );
  nonnegative(input.lightOnSeconds, "lightOnSeconds");
  const steady =
      input.internalDissipatedLightWatts /
      input.caseThermalConductanceWattsPerK,
    x =
      (input.lightOnSeconds * input.caseThermalConductanceWattsPerK) /
      input.caseEffectiveHeatCapacityJoulesPerK,
    rise =
      input.initialCaseMinusRoomTemperatureC +
      (steady - input.initialCaseMinusRoomTemperatureC) * -Math.expm1(-x);
  return {
    modelCaseTemperatureRiseC: rise,
    modelSteadyCaseTemperatureRiseC: steady,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  internalDissipatedLightWatts: 10,
  caseThermalConductanceWattsPerK: 2,
  caseEffectiveHeatCapacityJoulesPerK: 100,
  lightOnSeconds: 50,
  initialCaseMinusRoomTemperatureC: 0,
} satisfies Input;
export const exampleOutput = {
  modelCaseTemperatureRiseC: 3.1606027941427883,
  modelSteadyCaseTemperatureRiseC: 5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/case-light-heat-rise-estimate",
  title: "Case Internal Light Heat Rise Estimate Calculator",
  description:
    "Evaluate first-order lumped case light-heating transient with caller measured thermal parameters/initial offset; no ventilation/HVAC/material safety certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "modelCaseTemperatureRiseC",
      label: "Model case temperature rise c",
      kind: "number",
    },
    {
      id: "modelSteadyCaseTemperatureRiseC",
      label: "Model steady case temperature rise c",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      internalDissipatedLightWatts:
        value.internalDissipatedLightWatts as number,
      caseThermalConductanceWattsPerK:
        value.caseThermalConductanceWattsPerK as number,
      caseEffectiveHeatCapacityJoulesPerK:
        value.caseEffectiveHeatCapacityJoulesPerK as number,
      lightOnSeconds: value.lightOnSeconds as number,
      initialCaseMinusRoomTemperatureC:
        value.initialCaseMinusRoomTemperatureC as number,
    }),
});
export const run = tool.execute;
export default tool;

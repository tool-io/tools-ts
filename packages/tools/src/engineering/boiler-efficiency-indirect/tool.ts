import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerBoilerFuelInputJ: number;
  readonly callerIndependentStackLossJ: number;
  readonly callerIndependentMoistureLossJ: number;
  readonly callerIndependentUnburnedLossJ: number;
  readonly callerIndependentRadiationLossJ: number;
}>;
export type Output = Readonly<{
  readonly signedIndirectBoilerUsefulJ: number;
  readonly indirectBoilerEfficiency: number;
}>;
const inputFields = [
  {
    id: "callerBoilerFuelInputJ",
    label: "Caller boiler fuel input j",
    kind: "number",
  },
  {
    id: "callerIndependentStackLossJ",
    label: "Caller independent stack loss j",
    kind: "number",
  },
  {
    id: "callerIndependentMoistureLossJ",
    label: "Caller independent moisture loss j",
    kind: "number",
  },
  {
    id: "callerIndependentUnburnedLossJ",
    label: "Caller independent unburned loss j",
    kind: "number",
  },
  {
    id: "callerIndependentRadiationLossJ",
    label: "Caller independent radiation loss j",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerBoilerFuelInputJ, "callerBoilerFuelInputJ");
  nonnegative(input.callerIndependentStackLossJ, "callerIndependentStackLossJ");
  nonnegative(
    input.callerIndependentMoistureLossJ,
    "callerIndependentMoistureLossJ",
  );
  nonnegative(
    input.callerIndependentUnburnedLossJ,
    "callerIndependentUnburnedLossJ",
  );
  nonnegative(
    input.callerIndependentRadiationLossJ,
    "callerIndependentRadiationLossJ",
  );
  const useful =
    input.callerBoilerFuelInputJ -
    input.callerIndependentStackLossJ -
    input.callerIndependentMoistureLossJ -
    input.callerIndependentUnburnedLossJ -
    input.callerIndependentRadiationLossJ;
  return {
    signedIndirectBoilerUsefulJ: useful,
    indirectBoilerEfficiency: useful / input.callerBoilerFuelInputJ,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerBoilerFuelInputJ: 100,
  callerIndependentStackLossJ: 10,
  callerIndependentMoistureLossJ: 5,
  callerIndependentUnburnedLossJ: 2,
  callerIndependentRadiationLossJ: 3,
} satisfies Input;
export const exampleOutput = {
  signedIndirectBoilerUsefulJ: 80,
  indirectBoilerEfficiency: 0.8,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/boiler-efficiency-indirect",
  title: "Indirect Boiler Efficiency Calculator",
  description:
    "Indirect independently resolved loss-method boiler boundary, caller fuelHHV/LHV consistent; negative closure retained, no combustion settings. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedIndirectBoilerUsefulJ",
      label: "Signed indirect boiler useful j",
      kind: "number",
    },
    {
      id: "indirectBoilerEfficiency",
      label: "Indirect boiler efficiency",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerBoilerFuelInputJ: value.callerBoilerFuelInputJ as number,
      callerIndependentStackLossJ: value.callerIndependentStackLossJ as number,
      callerIndependentMoistureLossJ:
        value.callerIndependentMoistureLossJ as number,
      callerIndependentUnburnedLossJ:
        value.callerIndependentUnburnedLossJ as number,
      callerIndependentRadiationLossJ:
        value.callerIndependentRadiationLossJ as number,
    }),
});
export const run = tool.execute;
export default tool;

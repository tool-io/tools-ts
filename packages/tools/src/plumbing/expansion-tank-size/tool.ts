import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerMeasuredSystemExpansionLiters: number;
  readonly callerTankAbsoluteInitialGasPressureKpa: number;
  readonly callerTankAbsoluteMaximumGasPressureKpa: number;
}>;
export type Output = Readonly<{
  readonly idealIsothermalTankAcceptanceFraction: number;
  readonly requiredIdealNominalExpansionTankLiters: number;
}>;
const inputFields = [
  {
    id: "callerMeasuredSystemExpansionLiters",
    label: "Caller measured system expansion liters",
    kind: "number",
  },
  {
    id: "callerTankAbsoluteInitialGasPressureKpa",
    label: "Caller tank absolute initial gas pressure kpa",
    kind: "number",
  },
  {
    id: "callerTankAbsoluteMaximumGasPressureKpa",
    label: "Caller tank absolute maximum gas pressure kpa",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerTankAbsoluteInitialGasPressureKpa,
    "callerTankAbsoluteInitialGasPressureKpa",
  );
  positive(
    input.callerTankAbsoluteMaximumGasPressureKpa,
    "callerTankAbsoluteMaximumGasPressureKpa",
  );
  nonnegative(
    input.callerMeasuredSystemExpansionLiters,
    "callerMeasuredSystemExpansionLiters",
  );
  if (
    input.callerTankAbsoluteMaximumGasPressureKpa <=
    input.callerTankAbsoluteInitialGasPressureKpa
  )
    simpleError(
      "pressure",
      "Explicit absolute maximum exceeds initial gas pressure.",
    );
  const accept =
    1 -
    input.callerTankAbsoluteInitialGasPressureKpa /
      input.callerTankAbsoluteMaximumGasPressureKpa;
  return {
    idealIsothermalTankAcceptanceFraction: accept,
    requiredIdealNominalExpansionTankLiters:
      input.callerMeasuredSystemExpansionLiters / accept,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerMeasuredSystemExpansionLiters: 2,
  callerTankAbsoluteInitialGasPressureKpa: 100,
  callerTankAbsoluteMaximumGasPressureKpa: 200,
} satisfies Input;
export const exampleOutput = {
  idealIsothermalTankAcceptanceFraction: 0.5,
  requiredIdealNominalExpansionTankLiters: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/expansion-tank-size",
  title: "Plumbing Expansion Tank Size Calculator",
  description:
    "Ideal isothermal gas-acceptance expansion tank budget from independently measured expanded volume and explicit absolute pressures; bladder/dead-space/dynamic/code constraints excluded, not pressure vessel approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "idealIsothermalTankAcceptanceFraction",
      label: "Ideal isothermal tank acceptance fraction",
      kind: "number",
    },
    {
      id: "requiredIdealNominalExpansionTankLiters",
      label: "Required ideal nominal expansion tank liters",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerMeasuredSystemExpansionLiters:
        value.callerMeasuredSystemExpansionLiters as number,
      callerTankAbsoluteInitialGasPressureKpa:
        value.callerTankAbsoluteInitialGasPressureKpa as number,
      callerTankAbsoluteMaximumGasPressureKpa:
        value.callerTankAbsoluteMaximumGasPressureKpa as number,
    }),
});
export const run = tool.execute;
export default tool;

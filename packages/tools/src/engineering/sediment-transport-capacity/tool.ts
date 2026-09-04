import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerShieldsStress: number;
  readonly callerCriticalShieldsStress: number;
  readonly callerMpmCoefficient: number;
  readonly relativeSubmergedSedimentDensity: number;
  readonly gravityMSecond2: number;
  readonly grainDiameterM: number;
}>;
export type Output = Readonly<{
  readonly meyerPeterMullerBedloadM2Second: number;
}>;
const inputFields = [
  { id: "callerShieldsStress", label: "Caller shields stress", kind: "number" },
  {
    id: "callerCriticalShieldsStress",
    label: "Caller critical shields stress",
    kind: "number",
  },
  {
    id: "callerMpmCoefficient",
    label: "Caller mpm coefficient",
    kind: "number",
  },
  {
    id: "relativeSubmergedSedimentDensity",
    label: "Relative submerged sediment density",
    kind: "number",
  },
  { id: "gravityMSecond2", label: "Gravity m second2", kind: "number" },
  { id: "grainDiameterM", label: "Grain diameter m", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.relativeSubmergedSedimentDensity,
    "relativeSubmergedSedimentDensity",
  );
  positive(input.gravityMSecond2, "gravityMSecond2");
  positive(input.grainDiameterM, "grainDiameterM");
  nonnegative(input.callerShieldsStress, "callerShieldsStress");
  nonnegative(input.callerCriticalShieldsStress, "callerCriticalShieldsStress");
  nonnegative(input.callerMpmCoefficient, "callerMpmCoefficient");
  return {
    meyerPeterMullerBedloadM2Second:
      input.callerMpmCoefficient *
      Math.max(
        0,
        input.callerShieldsStress - input.callerCriticalShieldsStress,
      ) **
        1.5 *
      Math.sqrt(
        input.relativeSubmergedSedimentDensity *
          input.gravityMSecond2 *
          input.grainDiameterM ** 3,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerShieldsStress: 0.1,
  callerCriticalShieldsStress: 0.05,
  callerMpmCoefficient: 8,
  relativeSubmergedSedimentDensity: 1,
  gravityMSecond2: 10,
  grainDiameterM: 0.01,
} satisfies Input;
export const exampleOutput = {
  meyerPeterMullerBedloadM2Second: 0.00028284271247461907,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/sediment-transport-capacity",
  title: "Sediment Transport Capacity Calculator",
  description:
    "Caller calibrated Meyer–Peter–Müller excess Shields bedload per width, no total suspended capacity, field sediment supply or universal coefficient. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "meyerPeterMullerBedloadM2Second",
      label: "Meyer peter muller bedload m2 second",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerShieldsStress: value.callerShieldsStress as number,
      callerCriticalShieldsStress: value.callerCriticalShieldsStress as number,
      callerMpmCoefficient: value.callerMpmCoefficient as number,
      relativeSubmergedSedimentDensity:
        value.relativeSubmergedSedimentDensity as number,
      gravityMSecond2: value.gravityMSecond2 as number,
      grainDiameterM: value.grainDiameterM as number,
    }),
});
export const run = tool.execute;
export default tool;

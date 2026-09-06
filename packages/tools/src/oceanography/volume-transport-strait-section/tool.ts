import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  sum,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedSectionCellAreasM2: readonly number[];
  readonly observedNormalVelocitiesMSecond: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedStraitTransportM3Second: number;
  readonly forwardTransportM3Second: number;
  readonly reverseTransportM3Second: number;
}>;
const inputFields = [
  {
    id: "observedSectionCellAreasM2",
    label: "Observed section cell areas m2",
    kind: "numberList",
  },
  {
    id: "observedNormalVelocitiesMSecond",
    label: "Observed normal velocities m second",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedSectionCellAreasM2.forEach((v) =>
    positive(v, "observedSectionCellAreasM2"),
  );
  aligned(
    input.observedSectionCellAreasM2,
    input.observedNormalVelocitiesMSecond,
    "observedSectionCellAreasM2",
  );
  const flux = input.observedSectionCellAreasM2.map(
    (a, i) => a * input.observedNormalVelocitiesMSecond[i],
  );
  return {
    signedStraitTransportM3Second: sum(flux),
    forwardTransportM3Second: sum(flux.filter((v) => v > 0)),
    reverseTransportM3Second: sum(flux.filter((v) => v < 0)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSectionCellAreasM2: [10, 20],
  observedNormalVelocitiesMSecond: [2, -1],
} satisfies Input;
export const exampleOutput = {
  signedStraitTransportM3Second: 0,
  forwardTransportM3Second: 20,
  reverseTransportM3Second: -20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/volume-transport-strait-section",
  title: "Volume Transport Strait Section Calculator",
  description:
    "Actual sampled section cell normal flux with separate opposing flows, not singleAV or absolute cancellation. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedStraitTransportM3Second",
      label: "Signed strait transport m3 second",
      kind: "number",
    },
    {
      id: "forwardTransportM3Second",
      label: "Forward transport m3 second",
      kind: "number",
    },
    {
      id: "reverseTransportM3Second",
      label: "Reverse transport m3 second",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSectionCellAreasM2:
        value.observedSectionCellAreasM2 as readonly number[],
      observedNormalVelocitiesMSecond:
        value.observedNormalVelocitiesMSecond as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  integral,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedOffshoreStationsM: readonly number[];
  readonly observedAlongshoreVelocityMSecond: readonly number[];
  readonly callerLocalEffectiveWaterDepthM: readonly number[];
}>;
export type Output = Readonly<{
  readonly boundaryCurrentProfileTransportM3Second: number;
}>;
const inputFields = [
  {
    id: "observedOffshoreStationsM",
    label: "Observed offshore stations m",
    kind: "numberList",
  },
  {
    id: "observedAlongshoreVelocityMSecond",
    label: "Observed alongshore velocity m second",
    kind: "numberList",
  },
  {
    id: "callerLocalEffectiveWaterDepthM",
    label: "Caller local effective water depth m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerLocalEffectiveWaterDepthM.forEach((v) =>
    positive(v, "callerLocalEffectiveWaterDepthM"),
  );
  input.observedOffshoreStationsM.forEach((v) =>
    nonnegative(v, "observedOffshoreStationsM"),
  );
  aligned(
    input.observedOffshoreStationsM,
    input.callerLocalEffectiveWaterDepthM,
    "observedOffshoreStationsM",
  );
  return {
    boundaryCurrentProfileTransportM3Second: integral(
      input.observedOffshoreStationsM,
      input.observedAlongshoreVelocityMSecond.map(
        (v, i) => v * input.callerLocalEffectiveWaterDepthM[i],
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedOffshoreStationsM: [0, 1, 3],
  observedAlongshoreVelocityMSecond: [1, 2, 0],
  callerLocalEffectiveWaterDepthM: [2, 2, 2],
} satisfies Input;
export const exampleOutput = {
  boundaryCurrentProfileTransportM3Second: 7,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/boundary-current-flux-profile",
  title: "Boundary Current Flux Profile Calculator",
  description:
    "Integrate independently sampled depth-averaged boundary current flux per offshore station with piecewise-linear flux assumption, not area-cell sum. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "boundaryCurrentProfileTransportM3Second",
      label: "Boundary current profile transport m3 second",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedOffshoreStationsM:
        value.observedOffshoreStationsM as readonly number[],
      observedAlongshoreVelocityMSecond:
        value.observedAlongshoreVelocityMSecond as readonly number[],
      callerLocalEffectiveWaterDepthM:
        value.callerLocalEffectiveWaterDepthM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

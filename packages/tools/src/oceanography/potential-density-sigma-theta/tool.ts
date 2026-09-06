import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  potentialTemperature,
  seawaterDensity,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedTemperatureIpts68C: number;
  readonly observedPracticalSalinity: number;
  readonly observedPressureDbar: number;
  readonly callerReferencePressureDbar: number;
}>;
export type Output = Readonly<{
  readonly potentialTemperatureIpts68C: number;
  readonly referencePotentialDensityAnomalyKgM3: number;
}>;
const inputFields = [
  {
    id: "observedTemperatureIpts68C",
    label: "Observed temperature ipts68 c",
    kind: "number",
  },
  {
    id: "observedPracticalSalinity",
    label: "Observed practical salinity",
    kind: "number",
  },
  {
    id: "observedPressureDbar",
    label: "Observed pressure dbar",
    kind: "number",
  },
  {
    id: "callerReferencePressureDbar",
    label: "Caller reference pressure dbar",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const t = potentialTemperature(
    input.observedPracticalSalinity,
    input.observedTemperatureIpts68C,
    input.observedPressureDbar,
    input.callerReferencePressureDbar,
  );
  return {
    potentialTemperatureIpts68C: t,
    referencePotentialDensityAnomalyKgM3:
      seawaterDensity(
        t,
        input.observedPracticalSalinity,
        input.callerReferencePressureDbar,
      ) - 1000,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedTemperatureIpts68C: 0,
  observedPracticalSalinity: 0,
  observedPressureDbar: 0,
  callerReferencePressureDbar: 0,
} satisfies Input;
export const exampleOutput = {
  potentialTemperatureIpts68C: 0,
  referencePotentialDensityAnomalyKgM3: -0.157406,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/potential-density-sigma-theta",
  title: "Potential Density Sigma Theta Calculator",
  description:
    "UNESCO adiabatic potential temperature then EOS80 potential density−1000 at explicit reference; sigma-theta when reference0dbar, not in-situ density or TEOS 10. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "potentialTemperatureIpts68C",
      label: "Potential temperature ipts68 c",
      kind: "number",
    },
    {
      id: "referencePotentialDensityAnomalyKgM3",
      label: "Reference potential density anomaly kg m3",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedTemperatureIpts68C: value.observedTemperatureIpts68C as number,
      observedPracticalSalinity: value.observedPracticalSalinity as number,
      observedPressureDbar: value.observedPressureDbar as number,
      callerReferencePressureDbar: value.callerReferencePressureDbar as number,
    }),
});
export const run = tool.execute;
export default tool;

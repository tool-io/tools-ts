import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  linearFit,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedDiamondJunctionKelvin: readonly number[];
  readonly observedSaturationAmps: readonly number[];
  readonly callerBoltzmannEvKelvin: number;
}>;
export type Output = Readonly<{
  readonly fittedRichardsonBarrierEv: number;
  readonly fittedRichardsonLogAreaPrefactor: number;
  readonly richardsonFitRSquared: number;
}>;
const inputFields = [
  {
    id: "observedDiamondJunctionKelvin",
    label: "Observed diamond junction kelvin",
    kind: "numberList",
  },
  {
    id: "observedSaturationAmps",
    label: "Observed saturation amps",
    kind: "numberList",
  },
  {
    id: "callerBoltzmannEvKelvin",
    label: "Caller boltzmann ev kelvin",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedDiamondJunctionKelvin.forEach((v) =>
    positive(v, "observedDiamondJunctionKelvin"),
  );
  input.observedSaturationAmps.forEach((v) =>
    positive(v, "observedSaturationAmps"),
  );
  positive(input.callerBoltzmannEvKelvin, "callerBoltzmannEvKelvin");
  aligned(
    input.observedDiamondJunctionKelvin,
    input.observedSaturationAmps,
    "Richardson",
  );
  const fit = linearFit(
    input.observedDiamondJunctionKelvin.map((v) => 1 / v),
    input.observedSaturationAmps.map((v, i) => {
      const normalized =
        v /
        input.observedDiamondJunctionKelvin[i] /
        input.observedDiamondJunctionKelvin[i];
      positive(normalized, "Richardson normalized current");
      return Math.log(normalized);
    }),
  );
  return {
    fittedRichardsonBarrierEv: -fit.slope * input.callerBoltzmannEvKelvin,
    fittedRichardsonLogAreaPrefactor: fit.intercept,
    richardsonFitRSquared: fit.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDiamondJunctionKelvin: [100, 200, 400],
  observedSaturationAmps: [1, 4, 16],
  callerBoltzmannEvKelvin: 0.0001,
} satisfies Input;
export const exampleOutput = {
  fittedRichardsonBarrierEv: 0,
  fittedRichardsonLogAreaPrefactor: -9.210340371976182,
  richardsonFitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/diamond-schottky-barrier-height",
  title: "Semiconductor Diamond Schottky Barrier Height Calculator",
  description:
    "Extract actual diamond Schottky Richardson ln(Is/T²) versus1/T barrier fit, signed fitted evidence retained; not ideal work-function barrier or Gaussian distribution correction.",
  inputs: inputFields,
  outputs: [
    {
      id: "fittedRichardsonBarrierEv",
      label: "Fitted richardson barrier ev",
      kind: "number",
    },
    {
      id: "fittedRichardsonLogAreaPrefactor",
      label: "Fitted richardson log area prefactor",
      kind: "number",
    },
    {
      id: "richardsonFitRSquared",
      label: "Richardson fit r squared",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDiamondJunctionKelvin:
        value.observedDiamondJunctionKelvin as readonly number[],
      observedSaturationAmps: value.observedSaturationAmps as readonly number[],
      callerBoltzmannEvKelvin: value.callerBoltzmannEvKelvin as number,
    }),
});
export const run = tool.execute;
export default tool;

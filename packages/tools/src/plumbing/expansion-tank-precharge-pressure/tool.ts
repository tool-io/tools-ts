import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedColdFillGaugeKpa: number;
  readonly observedTankBelowFillReferenceMeters: number;
  readonly callerFluidDensityKgM3: number;
  readonly callerGravityMetersSecondSquared: number;
  readonly observedActualPrechargeGaugeKpa: number;
}>;
export type Output = Readonly<{
  readonly callerReferenceMatchedPrechargeGaugeKpa: number;
  readonly signedActualMinusReferenceMatchedPrechargeKpa: number;
}>;
const inputFields = [
  {
    id: "observedColdFillGaugeKpa",
    label: "Observed cold fill gauge kpa",
    kind: "number",
  },
  {
    id: "observedTankBelowFillReferenceMeters",
    label: "Observed tank below fill reference meters",
    kind: "number",
  },
  {
    id: "callerFluidDensityKgM3",
    label: "Caller fluid density kg m3",
    kind: "number",
  },
  {
    id: "callerGravityMetersSecondSquared",
    label: "Caller gravity meters second squared",
    kind: "number",
  },
  {
    id: "observedActualPrechargeGaugeKpa",
    label: "Observed actual precharge gauge kpa",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerFluidDensityKgM3, "callerFluidDensityKgM3");
  positive(
    input.callerGravityMetersSecondSquared,
    "callerGravityMetersSecondSquared",
  );
  nonnegative(input.observedColdFillGaugeKpa, "observedColdFillGaugeKpa");
  nonnegative(
    input.observedActualPrechargeGaugeKpa,
    "observedActualPrechargeGaugeKpa",
  );
  const pressure =
    input.observedColdFillGaugeKpa +
    (input.observedTankBelowFillReferenceMeters *
      input.callerFluidDensityKgM3 *
      input.callerGravityMetersSecondSquared) /
      1000;
  nonnegative(pressure, "referencePressure");
  return {
    callerReferenceMatchedPrechargeGaugeKpa: pressure,
    signedActualMinusReferenceMatchedPrechargeKpa:
      input.observedActualPrechargeGaugeKpa - pressure,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedColdFillGaugeKpa: 150,
  observedTankBelowFillReferenceMeters: 2,
  callerFluidDensityKgM3: 1000,
  callerGravityMetersSecondSquared: 10,
  observedActualPrechargeGaugeKpa: 160,
} satisfies Input;
export const exampleOutput = {
  callerReferenceMatchedPrechargeGaugeKpa: 170,
  signedActualMinusReferenceMatchedPrechargeKpa: -10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/expansion-tank-precharge-pressure",
  title: "Plumbing Expansion Tank Precharge Pressure Calculator",
  description:
    "Audit actual cold-fill pressure translated to tank elevation against independent observed precharge; signed elevation below reference, no setting procedure, automatic pressure adjustment or vessel safety assurance.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerReferenceMatchedPrechargeGaugeKpa",
      label: "Caller reference matched precharge gauge kpa",
      kind: "number",
    },
    {
      id: "signedActualMinusReferenceMatchedPrechargeKpa",
      label: "Signed actual minus reference matched precharge kpa",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedColdFillGaugeKpa: value.observedColdFillGaugeKpa as number,
      observedTankBelowFillReferenceMeters:
        value.observedTankBelowFillReferenceMeters as number,
      callerFluidDensityKgM3: value.callerFluidDensityKgM3 as number,
      callerGravityMetersSecondSquared:
        value.callerGravityMetersSecondSquared as number,
      observedActualPrechargeGaugeKpa:
        value.observedActualPrechargeGaugeKpa as number,
    }),
});
export const run = tool.execute;
export default tool;

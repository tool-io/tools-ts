import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  strictlyIncreasing,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedDepthsPositiveDownM: readonly number[];
  readonly callerMatchedPotentialDensitiesKgM3: readonly number[];
  readonly gravityMSecond2: number;
  readonly referenceDensityKgM3: number;
}>;
export type Output = Readonly<{
  readonly signedLayerBuoyancyFrequencySquaredSecond2: readonly number[];
}>;
const inputFields = [
  {
    id: "observedDepthsPositiveDownM",
    label: "Observed depths positive down m",
    kind: "numberList",
  },
  {
    id: "callerMatchedPotentialDensitiesKgM3",
    label: "Caller matched potential densities kg m3",
    kind: "numberList",
  },
  { id: "gravityMSecond2", label: "Gravity m second2", kind: "number" },
  {
    id: "referenceDensityKgM3",
    label: "Reference density kg m3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerMatchedPotentialDensitiesKgM3.forEach((v) =>
    positive(v, "callerMatchedPotentialDensitiesKgM3"),
  );
  positive(input.gravityMSecond2, "gravityMSecond2");
  positive(input.referenceDensityKgM3, "referenceDensityKgM3");
  input.observedDepthsPositiveDownM.forEach((v) =>
    nonnegative(v, "observedDepthsPositiveDownM"),
  );
  aligned(
    input.observedDepthsPositiveDownM,
    input.callerMatchedPotentialDensitiesKgM3,
    "density profile",
  );
  strictlyIncreasing(input.observedDepthsPositiveDownM, "depth");
  return {
    signedLayerBuoyancyFrequencySquaredSecond2:
      input.observedDepthsPositiveDownM
        .slice(1)
        .map(
          (v, i) =>
            ((input.gravityMSecond2 / input.referenceDensityKgM3) *
              (input.callerMatchedPotentialDensitiesKgM3[i + 1] -
                input.callerMatchedPotentialDensitiesKgM3[i])) /
            (v - input.observedDepthsPositiveDownM[i]),
        ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDepthsPositiveDownM: [0, 10, 30],
  callerMatchedPotentialDensitiesKgM3: [1000, 1001, 1000],
  gravityMSecond2: 10,
  referenceDensityKgM3: 1000,
} satisfies Input;
export const exampleOutput = {
  signedLayerBuoyancyFrequencySquaredSecond2: [0.001, -0.0005],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/brunt-vaisala-ocean-stability",
  title: "Brunt Vaisala Ocean Stability Calculator",
  description:
    "Ocean N² with depth positive DOWN and independently reference-matched potential density, unstable negativeN² retained without square root. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedLayerBuoyancyFrequencySquaredSecond2",
      label: "Signed layer buoyancy frequency squared second2",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDepthsPositiveDownM:
        value.observedDepthsPositiveDownM as readonly number[],
      callerMatchedPotentialDensitiesKgM3:
        value.callerMatchedPotentialDensitiesKgM3 as readonly number[],
      gravityMSecond2: value.gravityMSecond2 as number,
      referenceDensityKgM3: value.referenceDensityKgM3 as number,
    }),
});
export const run = tool.execute;
export default tool;

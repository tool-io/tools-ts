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
  fraction,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly callerVcselMirrorIntensityReflectivities: readonly number[];
  readonly observedVcselCavityLengthM: number;
  readonly callerDistributedInternalLossPerM: number;
  readonly callerConfinementFraction: number;
}>;
export type Output = Readonly<{
  readonly modeledVcselMaterialThresholdGainPerM: number;
}>;
const inputFields = [
  {
    id: "callerVcselMirrorIntensityReflectivities",
    label: "Caller vcsel mirror intensity reflectivities",
    kind: "numberList",
  },
  {
    id: "observedVcselCavityLengthM",
    label: "Observed vcsel cavity length m",
    kind: "number",
  },
  {
    id: "callerDistributedInternalLossPerM",
    label: "Caller distributed internal loss per m",
    kind: "number",
  },
  {
    id: "callerConfinementFraction",
    label: "Caller confinement fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerVcselMirrorIntensityReflectivities.forEach((v) =>
    positive(v, "callerVcselMirrorIntensityReflectivities"),
  );
  positive(input.observedVcselCavityLengthM, "observedVcselCavityLengthM");
  positive(input.callerConfinementFraction, "callerConfinementFraction");
  nonnegative(
    input.callerDistributedInternalLossPerM,
    "callerDistributedInternalLossPerM",
  );
  input.callerVcselMirrorIntensityReflectivities.forEach((v) =>
    fraction(v, "callerVcselMirrorIntensityReflectivities"),
  );
  fraction(input.callerConfinementFraction, "callerConfinementFraction");
  if (input.callerVcselMirrorIntensityReflectivities.length !== 2)
    simpleError("mirrors", "Two explicit intensity reflectivities required.");
  return {
    modeledVcselMaterialThresholdGainPerM:
      (input.callerDistributedInternalLossPerM -
        Math.log(
          input.callerVcselMirrorIntensityReflectivities[0] *
            input.callerVcselMirrorIntensityReflectivities[1],
        ) /
          (2 * input.observedVcselCavityLengthM)) /
      input.callerConfinementFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVcselMirrorIntensityReflectivities: [0.9, 0.8],
  observedVcselCavityLengthM: 1,
  callerDistributedInternalLossPerM: 0.1,
  callerConfinementFraction: 0.5,
} satisfies Input;
export const exampleOutput = {
  modeledVcselMaterialThresholdGainPerM: 0.528504066972036,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/vcsel-threshold-gain",
  title: "Semiconductor Vcsel Threshold Gain Calculator",
  description:
    "Budget VCSEL material threshold gain with explicit two intensity mirror reflectivities/confinement and internal loss; not cavity photon lifetime, no laser operating safety.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledVcselMaterialThresholdGainPerM",
      label: "Modeled vcsel material threshold gain per m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerVcselMirrorIntensityReflectivities:
        value.callerVcselMirrorIntensityReflectivities as readonly number[],
      observedVcselCavityLengthM: value.observedVcselCavityLengthM as number,
      callerDistributedInternalLossPerM:
        value.callerDistributedInternalLossPerM as number,
      callerConfinementFraction: value.callerConfinementFraction as number,
    }),
});
export const run = tool.execute;
export default tool;

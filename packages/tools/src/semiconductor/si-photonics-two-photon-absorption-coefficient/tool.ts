import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, aligned } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedInputIntensityWattsM2: readonly number[];
  readonly observedOutputIntensityWattsM2: readonly number[];
  readonly observedSiGuideLengthsM: readonly number[];
}>;
export type Output = Readonly<{
  readonly inferredTwoPhotonAbsorptionMeterWatts: readonly number[];
}>;
const inputFields = [
  {
    id: "observedInputIntensityWattsM2",
    label: "Observed input intensity watts m2",
    kind: "numberList",
  },
  {
    id: "observedOutputIntensityWattsM2",
    label: "Observed output intensity watts m2",
    kind: "numberList",
  },
  {
    id: "observedSiGuideLengthsM",
    label: "Observed si guide lengths m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedInputIntensityWattsM2.forEach((v) =>
    positive(v, "observedInputIntensityWattsM2"),
  );
  input.observedOutputIntensityWattsM2.forEach((v) =>
    positive(v, "observedOutputIntensityWattsM2"),
  );
  input.observedSiGuideLengthsM.forEach((v) =>
    positive(v, "observedSiGuideLengthsM"),
  );
  aligned(
    input.observedInputIntensityWattsM2,
    input.observedOutputIntensityWattsM2,
    "observedInputIntensityWattsM2",
  );
  aligned(
    input.observedInputIntensityWattsM2,
    input.observedSiGuideLengthsM,
    "observedInputIntensityWattsM2",
  );
  return {
    inferredTwoPhotonAbsorptionMeterWatts:
      input.observedInputIntensityWattsM2.map(
        (v, i) =>
          (1 / input.observedOutputIntensityWattsM2[i] - 1 / v) /
          input.observedSiGuideLengthsM[i],
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedInputIntensityWattsM2: [2, 4],
  observedOutputIntensityWattsM2: [1, 2],
  observedSiGuideLengthsM: [1, 2],
} satisfies Input;
export const exampleOutput = {
  inferredTwoPhotonAbsorptionMeterWatts: [0.5, 0.125],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/si-photonics-two-photon-absorption-coefficient",
  title:
    "Semiconductor Si Photonics Two Photon Absorption Coefficient Calculator",
  description:
    "Invert actual dI/dz=−βI² single-channel Si guide observations, signed apparent gain retained; caller has removed linear losses, not prescribed optical intensity.",
  inputs: inputFields,
  outputs: [
    {
      id: "inferredTwoPhotonAbsorptionMeterWatts",
      label: "Inferred two photon absorption meter watts",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedInputIntensityWattsM2:
        value.observedInputIntensityWattsM2 as readonly number[],
      observedOutputIntensityWattsM2:
        value.observedOutputIntensityWattsM2 as readonly number[],
      observedSiGuideLengthsM:
        value.observedSiGuideLengthsM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

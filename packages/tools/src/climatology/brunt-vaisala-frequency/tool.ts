import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, profile } from "../shared.js";

export type Input = Readonly<{
  readonly profileHeightsM: readonly number[];
  readonly virtualPotentialTemperaturesK: readonly number[];
  readonly gravityMPerSecondSquared: number;
}>;
export type Output = Readonly<{
  readonly layerBuoyancyFrequencySquaredPerSecond2: readonly number[];
  readonly stableLayerFrequencyPerSecond: readonly number[];
  readonly unstableLayerGrowthRatePerSecond: readonly number[];
}>;
const inputFields = [
  { id: "profileHeightsM", label: "Profile heights m", kind: "numberList" },
  {
    id: "virtualPotentialTemperaturesK",
    label: "Virtual potential temperatures k",
    kind: "numberList",
  },
  {
    id: "gravityMPerSecondSquared",
    label: "Gravity m per second squared",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.virtualPotentialTemperaturesK.forEach((v) =>
    positive(v, "virtualPotentialTemperaturesK"),
  );
  positive(input.gravityMPerSecondSquared, "gravityMPerSecondSquared");
  profile(input.profileHeightsM, input.virtualPotentialTemperaturesK);
  const layerBuoyancyFrequencySquaredPerSecond2 =
    input.virtualPotentialTemperaturesK
      .slice(1)
      .map(
        (t, i) =>
          (input.gravityMPerSecondSquared *
            (t - input.virtualPotentialTemperaturesK[i])) /
          (((t + input.virtualPotentialTemperaturesK[i]) / 2) *
            (input.profileHeightsM[i + 1] - input.profileHeightsM[i])),
      );
  return {
    layerBuoyancyFrequencySquaredPerSecond2,
    stableLayerFrequencyPerSecond: layerBuoyancyFrequencySquaredPerSecond2.map(
      (v) => Math.sqrt(Math.max(0, v)),
    ),
    unstableLayerGrowthRatePerSecond:
      layerBuoyancyFrequencySquaredPerSecond2.map((v) =>
        Math.sqrt(Math.max(0, -v)),
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  profileHeightsM: [0, 1000],
  virtualPotentialTemperaturesK: [300, 300],
  gravityMPerSecondSquared: 10,
} satisfies Input;
export const exampleOutput = {
  layerBuoyancyFrequencySquaredPerSecond2: [0],
  stableLayerFrequencyPerSecond: [0],
  unstableLayerGrowthRatePerSecond: [0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/brunt-vaisala-frequency",
  title: "Brunt-Vaisala Frequency",
  description:
    "Estimate layer N² from measured virtual potential temperature and report stable oscillation versus unstable growth separately; signed N² is preserved rather than attempting an imaginary frequency or claiming turbulence forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "layerBuoyancyFrequencySquaredPerSecond2",
      label: "Layer buoyancy frequency squared per second2",
      kind: "numberList",
    },
    {
      id: "stableLayerFrequencyPerSecond",
      label: "Stable layer frequency per second",
      kind: "numberList",
    },
    {
      id: "unstableLayerGrowthRatePerSecond",
      label: "Unstable layer growth rate per second",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      profileHeightsM: value.profileHeightsM as readonly number[],
      virtualPotentialTemperaturesK:
        value.virtualPotentialTemperaturesK as readonly number[],
      gravityMPerSecondSquared: value.gravityMPerSecondSquared as number,
    }),
});
export const run = tool.execute;
export default tool;

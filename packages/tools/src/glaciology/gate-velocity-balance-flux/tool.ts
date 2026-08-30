import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, aligned } from "../shared.js";
export type Input = Readonly<{
  readonly upstreamAreasM2: readonly number[];
  readonly upstreamBalancesMwePerYear: readonly number[];
  readonly gateCrossSectionM2: number;
  readonly waterDensityKgPerM3: number;
  readonly iceDensityKgPerM3: number;
}>;
export type Output = Readonly<{
  readonly requiredIceFluxM3PerYear: number;
  readonly balanceDepthMeanGateVelocityMPerYear: number;
}>;
const inputFields = [
  { id: "upstreamAreasM2", label: "Upstream areas m2", kind: "numberList" },
  {
    id: "upstreamBalancesMwePerYear",
    label: "Upstream balances mwe per year",
    kind: "numberList",
  },
  { id: "gateCrossSectionM2", label: "Gate cross section m2", kind: "number" },
  {
    id: "waterDensityKgPerM3",
    label: "Water density kg per m3",
    kind: "number",
  },
  { id: "iceDensityKgPerM3", label: "Ice density kg per m3", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.upstreamAreasM2.forEach((v) => positive(v, "upstreamAreasM2"));
  positive(input.gateCrossSectionM2, "gateCrossSectionM2");
  positive(input.waterDensityKgPerM3, "waterDensityKgPerM3");
  positive(input.iceDensityKgPerM3, "iceDensityKgPerM3");
  aligned(
    input.upstreamAreasM2,
    input.upstreamBalancesMwePerYear,
    "upstreamAreasM2",
  );
  const requiredIceFluxM3PerYear =
    (input.upstreamAreasM2.reduce(
      (s, v, i) => s + v * input.upstreamBalancesMwePerYear[i],
      0,
    ) *
      input.waterDensityKgPerM3) /
    input.iceDensityKgPerM3;
  return {
    requiredIceFluxM3PerYear,
    balanceDepthMeanGateVelocityMPerYear:
      requiredIceFluxM3PerYear / input.gateCrossSectionM2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  upstreamAreasM2: [100, 200],
  upstreamBalancesMwePerYear: [1, 0.5],
  gateCrossSectionM2: 10,
  waterDensityKgPerM3: 1000,
  iceDensityKgPerM3: 900,
} satisfies Input;
export const exampleOutput = {
  requiredIceFluxM3PerYear: 222.22222222222223,
  balanceDepthMeanGateVelocityMPerYear: 22.22222222222222,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/gate-velocity-balance-flux",
  title: "Gate Velocity Balance Flux",
  description:
    "Invert integrated upstream water-equivalent net balance to steady depth-mean gate velocity; negative balance demands inward flux under this ideal storage-free budget.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredIceFluxM3PerYear",
      label: "Required ice flux m3 per year",
      kind: "number",
    },
    {
      id: "balanceDepthMeanGateVelocityMPerYear",
      label: "Balance depth mean gate velocity m per year",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      upstreamAreasM2: value.upstreamAreasM2 as readonly number[],
      upstreamBalancesMwePerYear:
        value.upstreamBalancesMwePerYear as readonly number[],
      gateCrossSectionM2: value.gateCrossSectionM2 as number,
      waterDensityKgPerM3: value.waterDensityKgPerM3 as number,
      iceDensityKgPerM3: value.iceDensityKgPerM3 as number,
    }),
});
export const run = tool.execute;
export default tool;

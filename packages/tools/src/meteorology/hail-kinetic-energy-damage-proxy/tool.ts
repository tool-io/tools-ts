import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  count,
  aligned,
} from "../shared.js";

export type Input = Readonly<{
  readonly hailDiametersM: readonly number[];
  readonly impactSpeedsMPerSecond: readonly number[];
  readonly hailStoneCounts: readonly number[];
  readonly hailDensityKgPerM3: number;
  readonly representedImpactAreaM2: number;
}>;
export type Output = Readonly<{
  readonly totalModelHailKineticEnergyJ: number;
  readonly energyPerImpactAreaJPerM2: number;
}>;
const inputFields = [
  { id: "hailDiametersM", label: "Hail diameters m", kind: "numberList" },
  {
    id: "impactSpeedsMPerSecond",
    label: "Impact speeds m per second",
    kind: "numberList",
  },
  { id: "hailStoneCounts", label: "Hail stone counts", kind: "numberList" },
  { id: "hailDensityKgPerM3", label: "Hail density kg per m3", kind: "number" },
  {
    id: "representedImpactAreaM2",
    label: "Represented impact area m2",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.hailDensityKgPerM3, "hailDensityKgPerM3");
  positive(input.representedImpactAreaM2, "representedImpactAreaM2");
  input.hailDiametersM.forEach((v) => nonnegative(v, "hailDiametersM"));
  input.impactSpeedsMPerSecond.forEach((v) =>
    nonnegative(v, "impactSpeedsMPerSecond"),
  );
  input.hailStoneCounts.forEach((v) => count(v, "hailStoneCounts"));
  aligned(input.hailDiametersM, input.impactSpeedsMPerSecond, "hailDiametersM");
  aligned(input.hailDiametersM, input.hailStoneCounts, "hailDiametersM");
  const totalModelHailKineticEnergyJ = input.hailDiametersM.reduce(
    (s, d, i) =>
      s +
      ((input.hailDensityKgPerM3 * Math.PI * d ** 3) / 12) *
        input.impactSpeedsMPerSecond[i] ** 2 *
        input.hailStoneCounts[i],
    0,
  );
  return {
    totalModelHailKineticEnergyJ,
    energyPerImpactAreaJPerM2:
      totalModelHailKineticEnergyJ / input.representedImpactAreaM2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  hailDiametersM: [0.01, 0.02],
  impactSpeedsMPerSecond: [10, 20],
  hailStoneCounts: [1, 2],
  hailDensityKgPerM3: 1000,
  representedImpactAreaM2: 1,
} satisfies Input;
export const exampleOutput = {
  totalModelHailKineticEnergyJ: 1.7016960206944716,
  energyPerImpactAreaJPerM2: 1.7016960206944716,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/hail-kinetic-energy-damage-proxy",
  title: "Hail Kinetic Energy Damage Proxy",
  description:
    "Sum spherical caller hail inventory kinetic energy per represented impact area; impact speeds are supplied, not terminal-speed lookup, and energy alone is not a damage, injury or safe-shelter prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "totalModelHailKineticEnergyJ",
      label: "Total model hail kinetic energy j",
      kind: "number",
    },
    {
      id: "energyPerImpactAreaJPerM2",
      label: "Energy per impact area j per m2",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      hailDiametersM: value.hailDiametersM as readonly number[],
      impactSpeedsMPerSecond: value.impactSpeedsMPerSecond as readonly number[],
      hailStoneCounts: value.hailStoneCounts as readonly number[],
      hailDensityKgPerM3: value.hailDensityKgPerM3 as number,
      representedImpactAreaM2: value.representedImpactAreaM2 as number,
    }),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../shared.js";

export type Input = Readonly<{
  readonly downwellingShortwaveWPerM2: readonly number[];
  readonly upwellingShortwaveWPerM2: readonly number[];
  readonly downwellingLongwaveWPerM2: readonly number[];
  readonly upwellingLongwaveWPerM2: readonly number[];
  readonly representedSeconds: readonly number[];
}>;
export type Output = Readonly<{
  readonly netSurfaceRadiationWPerM2: readonly number[];
  readonly integratedNetSurfaceRadiationJPerM2: number;
  readonly exposureWeightedNetRadiationWPerM2: number;
}>;
const inputFields = [
  {
    id: "downwellingShortwaveWPerM2",
    label: "Downwelling shortwave w per m2",
    kind: "numberList",
  },
  {
    id: "upwellingShortwaveWPerM2",
    label: "Upwelling shortwave w per m2",
    kind: "numberList",
  },
  {
    id: "downwellingLongwaveWPerM2",
    label: "Downwelling longwave w per m2",
    kind: "numberList",
  },
  {
    id: "upwellingLongwaveWPerM2",
    label: "Upwelling longwave w per m2",
    kind: "numberList",
  },
  {
    id: "representedSeconds",
    label: "Represented seconds",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.representedSeconds.forEach((v) => positive(v, "representedSeconds"));
  input.downwellingShortwaveWPerM2.forEach((v) =>
    nonnegative(v, "downwellingShortwaveWPerM2"),
  );
  input.upwellingShortwaveWPerM2.forEach((v) =>
    nonnegative(v, "upwellingShortwaveWPerM2"),
  );
  input.downwellingLongwaveWPerM2.forEach((v) =>
    nonnegative(v, "downwellingLongwaveWPerM2"),
  );
  input.upwellingLongwaveWPerM2.forEach((v) =>
    nonnegative(v, "upwellingLongwaveWPerM2"),
  );
  aligned(
    input.downwellingShortwaveWPerM2,
    input.upwellingShortwaveWPerM2,
    "downwellingShortwaveWPerM2",
  );
  aligned(
    input.downwellingShortwaveWPerM2,
    input.downwellingLongwaveWPerM2,
    "downwellingShortwaveWPerM2",
  );
  aligned(
    input.downwellingShortwaveWPerM2,
    input.upwellingLongwaveWPerM2,
    "downwellingShortwaveWPerM2",
  );
  aligned(
    input.downwellingShortwaveWPerM2,
    input.representedSeconds,
    "downwellingShortwaveWPerM2",
  );
  const netSurfaceRadiationWPerM2 = input.downwellingShortwaveWPerM2.map(
      (v, i) =>
        v -
        input.upwellingShortwaveWPerM2[i] +
        input.downwellingLongwaveWPerM2[i] -
        input.upwellingLongwaveWPerM2[i],
    ),
    integratedNetSurfaceRadiationJPerM2 = netSurfaceRadiationWPerM2.reduce(
      (s, v, i) => s + v * input.representedSeconds[i],
      0,
    );
  return {
    netSurfaceRadiationWPerM2,
    integratedNetSurfaceRadiationJPerM2,
    exposureWeightedNetRadiationWPerM2:
      integratedNetSurfaceRadiationJPerM2 /
      input.representedSeconds.reduce((a, b) => a + b, 0),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  downwellingShortwaveWPerM2: [100, 200],
  upwellingShortwaveWPerM2: [20, 60],
  downwellingLongwaveWPerM2: [300, 300],
  upwellingLongwaveWPerM2: [350, 330],
  representedSeconds: [1, 2],
} satisfies Input;
export const exampleOutput = {
  netSurfaceRadiationWPerM2: [30, 110],
  integratedNetSurfaceRadiationJPerM2: 250,
  exposureWeightedNetRadiationWPerM2: 83.33333333333333,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/net-radiation-budget-surface-balance",
  title: "Net Radiation Budget Surface Balance",
  description:
    "Account measured down/up shortwave and longwave fluxes with declared downward-positive net convention and actual exposure; no inferred surface emissivity, sensible/latent partition or equilibrium temperature.",
  inputs: inputFields,
  outputs: [
    {
      id: "netSurfaceRadiationWPerM2",
      label: "Net surface radiation w per m2",
      kind: "numberList",
    },
    {
      id: "integratedNetSurfaceRadiationJPerM2",
      label: "Integrated net surface radiation j per m2",
      kind: "number",
    },
    {
      id: "exposureWeightedNetRadiationWPerM2",
      label: "Exposure weighted net radiation w per m2",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      downwellingShortwaveWPerM2:
        value.downwellingShortwaveWPerM2 as readonly number[],
      upwellingShortwaveWPerM2:
        value.upwellingShortwaveWPerM2 as readonly number[],
      downwellingLongwaveWPerM2:
        value.downwellingLongwaveWPerM2 as readonly number[],
      upwellingLongwaveWPerM2:
        value.upwellingLongwaveWPerM2 as readonly number[],
      representedSeconds: value.representedSeconds as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

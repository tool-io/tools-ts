import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  sliceProfile,
  signedArea,
  buoyancy,
} from "../shared.js";

export type Input = Readonly<{
  readonly heightsM: readonly number[];
  readonly parcelVirtualTemperaturesK: readonly number[];
  readonly environmentVirtualTemperaturesK: readonly number[];
  readonly gravityMPerSecondSquared: number;
  readonly integrationBottomM: number;
  readonly integrationTopM: number;
}>;
export type Output = Readonly<{
  readonly positiveBuoyancyCapeJPerKg: number;
  readonly integratedBuoyancyMPerSecond2: readonly number[];
}>;
const inputFields = [
  { id: "heightsM", label: "Heights m", kind: "numberList" },
  {
    id: "parcelVirtualTemperaturesK",
    label: "Parcel virtual temperatures k",
    kind: "numberList",
  },
  {
    id: "environmentVirtualTemperaturesK",
    label: "Environment virtual temperatures k",
    kind: "numberList",
  },
  {
    id: "gravityMPerSecondSquared",
    label: "Gravity m per second squared",
    kind: "number",
  },
  { id: "integrationBottomM", label: "Integration bottom m", kind: "number" },
  { id: "integrationTopM", label: "Integration top m", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const b = buoyancy(
      input.parcelVirtualTemperaturesK,
      input.environmentVirtualTemperaturesK,
      input.gravityMPerSecondSquared,
    ),
    p = sliceProfile(
      input.heightsM,
      b,
      input.integrationBottomM,
      input.integrationTopM,
    );
  return {
    positiveBuoyancyCapeJPerKg: signedArea(p.z, p.y, true),
    integratedBuoyancyMPerSecond2: p.y,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  heightsM: [0, 1000, 2000],
  parcelVirtualTemperaturesK: [300, 330, 300],
  environmentVirtualTemperaturesK: [300, 300, 300],
  gravityMPerSecondSquared: 10,
  integrationBottomM: 0,
  integrationTopM: 2000,
} satisfies Input;
export const exampleOutput = {
  positiveBuoyancyCapeJPerKg: 1000,
  integratedBuoyancyMPerSecond2: [0, 1, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/cape-convective-available-potential-energy",
  title: "CAPE Convective Available Potential Energy",
  description:
    "Integrate positive portions of caller precomputed virtual parcel/environment buoyancy in observed height window, resolving each linear zero crossing; no hidden parcel lift, full sounding CAPE outside coverage or storm safety.",
  inputs: inputFields,
  outputs: [
    {
      id: "positiveBuoyancyCapeJPerKg",
      label: "Positive buoyancy cape j per kg",
      kind: "number",
    },
    {
      id: "integratedBuoyancyMPerSecond2",
      label: "Integrated buoyancy m per second2",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      heightsM: value.heightsM as readonly number[],
      parcelVirtualTemperaturesK:
        value.parcelVirtualTemperaturesK as readonly number[],
      environmentVirtualTemperaturesK:
        value.environmentVirtualTemperaturesK as readonly number[],
      gravityMPerSecondSquared: value.gravityMPerSecondSquared as number,
      integrationBottomM: value.integrationBottomM as number,
      integrationTopM: value.integrationTopM as number,
    }),
});
export const run = tool.execute;
export default tool;

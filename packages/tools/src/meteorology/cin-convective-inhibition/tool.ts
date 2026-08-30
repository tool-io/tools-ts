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
  readonly signedConvectiveInhibitionJPerKg: number;
  readonly inhibitionMagnitudeJPerKg: number;
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
    ),
    signedConvectiveInhibitionJPerKg = signedArea(p.z, p.y, false);
  return {
    signedConvectiveInhibitionJPerKg,
    inhibitionMagnitudeJPerKg: -signedConvectiveInhibitionJPerKg,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  heightsM: [0, 1000, 2000],
  parcelVirtualTemperaturesK: [270, 300, 330],
  environmentVirtualTemperaturesK: [300, 300, 300],
  gravityMPerSecondSquared: 10,
  integrationBottomM: 0,
  integrationTopM: 2000,
} satisfies Input;
export const exampleOutput = {
  signedConvectiveInhibitionJPerKg: -500,
  inhibitionMagnitudeJPerKg: 500,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/cin-convective-inhibition",
  title: "CIN Convective Inhibition",
  description:
    "Integrate only negative caller parcel virtual-buoyancy segments in bounded observed window, retaining signed CIN and magnitude; boundary choices/parcel lift are caller declared, not inferred complete sounding inhibition.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedConvectiveInhibitionJPerKg",
      label: "Signed convective inhibition j per kg",
      kind: "number",
    },
    {
      id: "inhibitionMagnitudeJPerKg",
      label: "Inhibition magnitude j per kg",
      kind: "number",
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

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
  count,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly beadOuterDiametersMm: readonly number[];
  readonly beadDrillDiametersMm: readonly number[];
  readonly beadCounts: readonly number[];
  readonly beadDensitiesGramsPerCm3: readonly number[];
}>;
export type Output = Readonly<{
  readonly modeledStrandBeadMassGrams: number;
  readonly modeledNetBeadVolumesMm3: readonly number[];
}>;
const inputFields = [
  {
    id: "beadOuterDiametersMm",
    label: "Bead outer diameters mm",
    kind: "numberList",
  },
  {
    id: "beadDrillDiametersMm",
    label: "Bead drill diameters mm",
    kind: "numberList",
  },
  { id: "beadCounts", label: "Bead counts", kind: "numberList" },
  {
    id: "beadDensitiesGramsPerCm3",
    label: "Bead densities grams per cm3",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.beadOuterDiametersMm.forEach((v) =>
    positive(v, "beadOuterDiametersMm"),
  );
  input.beadDensitiesGramsPerCm3.forEach((v) =>
    positive(v, "beadDensitiesGramsPerCm3"),
  );
  input.beadDrillDiametersMm.forEach((v) =>
    nonnegative(v, "beadDrillDiametersMm"),
  );
  input.beadCounts.forEach((v) => count(v, "beadCounts"));
  aligned(
    input.beadOuterDiametersMm,
    input.beadDrillDiametersMm,
    "beadOuterDiametersMm",
  );
  aligned(input.beadOuterDiametersMm, input.beadCounts, "beadOuterDiametersMm");
  aligned(
    input.beadOuterDiametersMm,
    input.beadDensitiesGramsPerCm3,
    "beadOuterDiametersMm",
  );
  const modeledNetBeadVolumesMm3 = input.beadOuterDiametersMm.map((d, i) => {
    const h = input.beadDrillDiametersMm[i];
    if (h > d)
      simpleError(
        "drill",
        "Centered cylindrical drill diameter cannot exceed spherical bead diameter.",
      );
    return (Math.PI / 6) * ((d - h) * (d + h)) ** 1.5;
  });
  return {
    modeledStrandBeadMassGrams: modeledNetBeadVolumesMm3.reduce(
      (s, v, i) =>
        s +
        (v / 1000) * input.beadDensitiesGramsPerCm3[i] * input.beadCounts[i],
      0,
    ),
    modeledNetBeadVolumesMm3,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  beadOuterDiametersMm: [2, 4],
  beadDrillDiametersMm: [0, 0],
  beadCounts: [10, 1],
  beadDensitiesGramsPerCm3: [2, 2],
} satisfies Input;
export const exampleOutput = {
  modeledStrandBeadMassGrams: 0.15079644737231007,
  modeledNetBeadVolumesMm3: [4.1887902047863905, 33.510321638291124],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/graduated-strand-weight",
  title: "Graduated Strand Weight",
  description:
    "Account heterogeneous graduated spherical bead density/count inventory using exact centered-bore napkin-ring volume, not subtracting a full-length cylinder through curved sphere; excludes cord/clasp and non-spherical pearls.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledStrandBeadMassGrams",
      label: "Modeled strand bead mass grams",
      kind: "number",
    },
    {
      id: "modeledNetBeadVolumesMm3",
      label: "Modeled net bead volumes mm3",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      beadOuterDiametersMm: value.beadOuterDiametersMm as readonly number[],
      beadDrillDiametersMm: value.beadDrillDiametersMm as readonly number[],
      beadCounts: value.beadCounts as readonly number[],
      beadDensitiesGramsPerCm3:
        value.beadDensitiesGramsPerCm3 as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

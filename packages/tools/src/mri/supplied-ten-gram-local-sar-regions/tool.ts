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
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly voxelMassesGrams: readonly number[];
  readonly voxelAbsorbedPowersWatts: readonly number[];
  readonly regionVoxelFractions: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly regionSarWattsPerKg: readonly number[];
  readonly maximumLocalSarWattsPerKg: number;
}>;
const inputFields = [
  { id: "voxelMassesGrams", label: "Voxel masses grams", kind: "numberList" },
  {
    id: "voxelAbsorbedPowersWatts",
    label: "Voxel absorbed powers watts",
    kind: "numberList",
  },
  {
    id: "regionVoxelFractions",
    label: "Region voxel fractions",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.voxelMassesGrams,
    input.voxelAbsorbedPowersWatts,
    "voxelMassesGrams",
  );
  input.voxelMassesGrams.forEach((v) => positive(v, "voxelMassesGrams"));
  input.voxelAbsorbedPowersWatts.forEach((v) =>
    nonnegative(v, "voxelAbsorbedPowersWatts"),
  );
  if (!input.regionVoxelFractions.length)
    simpleError(
      "regionVoxelFractions",
      "Nonempty spatially predefined 10-gram regions required.",
    );
  const regionSarWattsPerKg = input.regionVoxelFractions.map((row) => {
    if (row.length !== input.voxelMassesGrams.length)
      simpleError("regionVoxelFractions", "One fraction per voxel required.");
    row.forEach((v) => fraction(v, "regionVoxelFractions"));
    const grams = row.reduce((s, v, i) => s + v * input.voxelMassesGrams[i], 0);
    if (Math.abs(grams - 10) > 1e-8)
      simpleError(
        "regionVoxelFractions",
        "Each supplied local region must contain 10 grams.",
      );
    return (
      row.reduce((s, v, i) => s + v * input.voxelAbsorbedPowersWatts[i], 0) /
      (grams / 1000)
    );
  });
  return {
    regionSarWattsPerKg,
    maximumLocalSarWattsPerKg: Math.max(...regionSarWattsPerKg),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  voxelMassesGrams: [5, 5, 5],
  voxelAbsorbedPowersWatts: [0.01, 0.02, 0.03],
  regionVoxelFractions: [
    [1, 1, 0],
    [0, 1, 1],
  ],
} satisfies Input;
export const exampleOutput = {
  regionSarWattsPerKg: [3, 5],
  maximumLocalSarWattsPerKg: 5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/supplied-ten-gram-local-sar-regions",
  title: "Local 10g SAR",
  description:
    "Compute local SAR for caller-supplied spatial 10-gram voxel-fraction regions; does not construct IEC-compliant regions, solve RF fields, or certify scanner safety.",
  inputs: inputFields,
  outputs: [
    {
      id: "regionSarWattsPerKg",
      label: "Region sar watts per kg",
      kind: "numberList",
      unit: "kg",
    },
    {
      id: "maximumLocalSarWattsPerKg",
      label: "Maximum local sar watts per kg",
      kind: "number",
      unit: "kg",
    },
  ],
  calculate: (value) =>
    calculate({
      voxelMassesGrams: value.voxelMassesGrams as readonly number[],
      voxelAbsorbedPowersWatts:
        value.voxelAbsorbedPowersWatts as readonly number[],
      regionVoxelFractions:
        value.regionVoxelFractions as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;

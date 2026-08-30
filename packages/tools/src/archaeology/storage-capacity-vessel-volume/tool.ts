import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly vesselInteriorVolumesLiters: readonly number[];
  readonly usableFillFractions: readonly number[];
  readonly storedMaterialBulkDensityKgPerLiter: number;
}>;
export type Output = Readonly<{
  readonly usableStorageLiters: number;
  readonly modelStoredMassKg: number;
}>;
const inputFields = [
  {
    id: "vesselInteriorVolumesLiters",
    label: "Vessel interior volumes liters",
    kind: "numberList",
  },
  {
    id: "usableFillFractions",
    label: "Usable fill fractions",
    kind: "numberList",
  },
  {
    id: "storedMaterialBulkDensityKgPerLiter",
    label: "Stored material bulk density kg per liter",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.storedMaterialBulkDensityKgPerLiter,
    "storedMaterialBulkDensityKgPerLiter",
  );
  input.vesselInteriorVolumesLiters.forEach((v) =>
    nonnegative(v, "vesselInteriorVolumesLiters"),
  );
  input.usableFillFractions.forEach((v) => fraction(v, "usableFillFractions"));
  aligned(
    input.vesselInteriorVolumesLiters,
    input.usableFillFractions,
    "vesselInteriorVolumesLiters",
  );
  const usableStorageLiters = input.vesselInteriorVolumesLiters.reduce(
    (s, v, i) => s + v * input.usableFillFractions[i],
    0,
  );
  return {
    usableStorageLiters,
    modelStoredMassKg:
      usableStorageLiters * input.storedMaterialBulkDensityKgPerLiter,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  vesselInteriorVolumesLiters: [10, 20],
  usableFillFractions: [0.8, 0.5],
  storedMaterialBulkDensityKgPerLiter: 0.5,
} satisfies Input;
export const exampleOutput = {
  usableStorageLiters: 18,
  modelStoredMassKg: 9,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/storage-capacity-vessel-volume",
  title: "Storage Capacity From Vessel Volume",
  description:
    "Aggregate interior vessel capacity with explicit usable fill and independently supplied bulk material density; does not infer original contents or nutritional adequacy.",
  inputs: inputFields,
  outputs: [
    {
      id: "usableStorageLiters",
      label: "Usable storage liters",
      kind: "number",
    },
    { id: "modelStoredMassKg", label: "Model stored mass kg", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      vesselInteriorVolumesLiters:
        value.vesselInteriorVolumesLiters as readonly number[],
      usableFillFractions: value.usableFillFractions as readonly number[],
      storedMaterialBulkDensityKgPerLiter:
        value.storedMaterialBulkDensityKgPerLiter as number,
    }),
});
export const run = tool.execute;
export default tool;

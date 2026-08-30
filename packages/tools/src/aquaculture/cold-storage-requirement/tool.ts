import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../shared.js";
export type Input = Readonly<{
  readonly productMassKg: number;
  readonly packedProductDensityKgPerM3: number;
  readonly usableStorageFraction: number;
  readonly availableRoomVolumeM3: number;
}>;
export type Output = Readonly<{
  readonly netPackedProductVolumeM3: number;
  readonly requiredGrossRoomVolumeM3: number;
  readonly roomVolumeMarginM3: number;
  readonly volumeFits: boolean;
}>;
const inputFields = [
  { id: "productMassKg", label: "Product mass kg", kind: "number" },
  {
    id: "packedProductDensityKgPerM3",
    label: "Packed product density kg per m3",
    kind: "number",
  },
  {
    id: "usableStorageFraction",
    label: "Usable storage fraction",
    kind: "number",
  },
  {
    id: "availableRoomVolumeM3",
    label: "Available room volume m3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.packedProductDensityKgPerM3, "packedProductDensityKgPerM3");
  positive(input.usableStorageFraction, "usableStorageFraction");
  nonnegative(input.productMassKg, "productMassKg");
  nonnegative(input.availableRoomVolumeM3, "availableRoomVolumeM3");
  fraction(input.usableStorageFraction, "usableStorageFraction");
  const netPackedProductVolumeM3 =
      input.productMassKg / input.packedProductDensityKgPerM3,
    requiredGrossRoomVolumeM3 =
      netPackedProductVolumeM3 / input.usableStorageFraction;
  return {
    netPackedProductVolumeM3,
    requiredGrossRoomVolumeM3,
    roomVolumeMarginM3: input.availableRoomVolumeM3 - requiredGrossRoomVolumeM3,
    volumeFits: input.availableRoomVolumeM3 >= requiredGrossRoomVolumeM3,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  productMassKg: 1000,
  packedProductDensityKgPerM3: 500,
  usableStorageFraction: 0.5,
  availableRoomVolumeM3: 3,
} satisfies Input;
export const exampleOutput = {
  netPackedProductVolumeM3: 2,
  requiredGrossRoomVolumeM3: 4,
  roomVolumeMarginM3: -1,
  volumeFits: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aquaculture/cold-storage-requirement",
  title: "Cold Storage Requirement",
  description:
    "Estimate cold-room volume from packed product density and caller usable fraction with access/airflow already included; not refrigeration load or shelf-life certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "netPackedProductVolumeM3",
      label: "Net packed product volume m3",
      kind: "number",
    },
    {
      id: "requiredGrossRoomVolumeM3",
      label: "Required gross room volume m3",
      kind: "number",
    },
    {
      id: "roomVolumeMarginM3",
      label: "Room volume margin m3",
      kind: "number",
    },
    { id: "volumeFits", label: "Volume fits", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      productMassKg: value.productMassKg as number,
      packedProductDensityKgPerM3: value.packedProductDensityKgPerM3 as number,
      usableStorageFraction: value.usableStorageFraction as number,
      availableRoomVolumeM3: value.availableRoomVolumeM3 as number,
    }),
});
export const run = tool.execute;
export default tool;

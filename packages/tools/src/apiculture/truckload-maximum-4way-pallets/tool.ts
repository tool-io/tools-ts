import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  integer,
  exactProduct,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly truckUsableWidthCm: number;
  readonly truckUsableLengthCm: number;
  readonly palletWidthCm: number;
  readonly palletLengthCm: number;
  readonly callerPayloadLimitKg: number;
  readonly observedLoadedPalletMassKg: number;
}>;
export type Output = Readonly<{
  readonly bestUniformGridPalletCapacity: number;
  readonly payloadPalletCapacity: number;
  readonly conditionalLimitedPalletCount: number;
}>;
const inputFields = [
  { id: "truckUsableWidthCm", label: "Truck usable width cm", kind: "number" },
  {
    id: "truckUsableLengthCm",
    label: "Truck usable length cm",
    kind: "number",
  },
  { id: "palletWidthCm", label: "Pallet width cm", kind: "number" },
  { id: "palletLengthCm", label: "Pallet length cm", kind: "number" },
  {
    id: "callerPayloadLimitKg",
    label: "Caller payload limit kg",
    kind: "number",
  },
  {
    id: "observedLoadedPalletMassKg",
    label: "Observed loaded pallet mass kg",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.truckUsableWidthCm, "truckUsableWidthCm");
  positive(input.truckUsableLengthCm, "truckUsableLengthCm");
  positive(input.palletWidthCm, "palletWidthCm");
  positive(input.palletLengthCm, "palletLengthCm");
  positive(input.observedLoadedPalletMassKg, "observedLoadedPalletMassKg");
  nonnegative(input.callerPayloadLimitKg, "callerPayloadLimitKg");
  const a = exactProduct(
      Math.floor(input.truckUsableWidthCm / input.palletWidthCm),
      Math.floor(input.truckUsableLengthCm / input.palletLengthCm),
    ),
    b = exactProduct(
      Math.floor(input.truckUsableWidthCm / input.palletLengthCm),
      Math.floor(input.truckUsableLengthCm / input.palletWidthCm),
    ),
    g = Math.max(a, b),
    p = integer(
      Math.floor(input.callerPayloadLimitKg / input.observedLoadedPalletMassKg),
      "payload capacity",
    );
  return {
    bestUniformGridPalletCapacity: g,
    payloadPalletCapacity: p,
    conditionalLimitedPalletCount: Math.min(g, p),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  truckUsableWidthCm: 200,
  truckUsableLengthCm: 400,
  palletWidthCm: 100,
  palletLengthCm: 100,
  callerPayloadLimitKg: 250,
  observedLoadedPalletMassKg: 100,
} satisfies Input;
export const exampleOutput = {
  bestUniformGridPalletCapacity: 8,
  payloadPalletCapacity: 2,
  conditionalLimitedPalletCount: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/truckload-maximum-4way-pallets",
  title: "Truckload Maximum 4 Way Pallets Calculator",
  description:
    "Equal-pallet best uniform two-orientation grid plus independently verified payload cap; four-way access does not permit assumed load restraint, axle distribution or globally mixed packing optimum. Caller independently verifies strain, site, protocol and evidence; not colony-health, treatment, transport-safety or regulatory certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "bestUniformGridPalletCapacity",
      label: "Best uniform grid pallet capacity",
      kind: "number",
    },
    {
      id: "payloadPalletCapacity",
      label: "Payload pallet capacity",
      kind: "number",
    },
    {
      id: "conditionalLimitedPalletCount",
      label: "Conditional limited pallet count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      truckUsableWidthCm: value.truckUsableWidthCm as number,
      truckUsableLengthCm: value.truckUsableLengthCm as number,
      palletWidthCm: value.palletWidthCm as number,
      palletLengthCm: value.palletLengthCm as number,
      callerPayloadLimitKg: value.callerPayloadLimitKg as number,
      observedLoadedPalletMassKg: value.observedLoadedPalletMassKg as number,
    }),
});
export const run = tool.execute;
export default tool;

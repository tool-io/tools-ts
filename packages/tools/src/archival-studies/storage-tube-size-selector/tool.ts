import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  ordered,
} from "../shared.js";
export type Input = Readonly<{
  readonly rolledItemLengthMm: number;
  readonly itemThicknessMm: number;
  readonly coreOuterDiameterMm: number;
  readonly callerRadialClearanceMm: number;
  readonly availableTubeInternalDiametersMm: readonly number[];
}>;
export type Output = Readonly<{
  readonly uncompressedModelRollOuterDiameterMm: number;
  readonly minimumCallerTubeInternalDiameterMm: number;
  readonly selectedTubeInternalDiameterMm: number;
  readonly availableTubeFound: boolean;
}>;
const inputFields = [
  { id: "rolledItemLengthMm", label: "Rolled item length mm", kind: "number" },
  { id: "itemThicknessMm", label: "Item thickness mm", kind: "number" },
  {
    id: "coreOuterDiameterMm",
    label: "Core outer diameter mm",
    kind: "number",
  },
  {
    id: "callerRadialClearanceMm",
    label: "Caller radial clearance mm",
    kind: "number",
  },
  {
    id: "availableTubeInternalDiametersMm",
    label: "Available tube internal diameters mm",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.availableTubeInternalDiametersMm.forEach((v) =>
    positive(v, "availableTubeInternalDiametersMm"),
  );
  nonnegative(input.rolledItemLengthMm, "rolledItemLengthMm");
  nonnegative(input.itemThicknessMm, "itemThicknessMm");
  nonnegative(input.coreOuterDiameterMm, "coreOuterDiameterMm");
  nonnegative(input.callerRadialClearanceMm, "callerRadialClearanceMm");
  ordered(input.availableTubeInternalDiametersMm, "tubes");
  const d =
      2 *
      Math.sqrt(
        (input.coreOuterDiameterMm / 2) ** 2 +
          (input.rolledItemLengthMm * input.itemThicknessMm) / Math.PI,
      ),
    required = d + 2 * input.callerRadialClearanceMm,
    selected = input.availableTubeInternalDiametersMm.find(
      (v) => v >= required,
    );
  return {
    uncompressedModelRollOuterDiameterMm: d,
    minimumCallerTubeInternalDiameterMm: required,
    selectedTubeInternalDiameterMm: selected ?? 0,
    availableTubeFound: selected !== undefined,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  rolledItemLengthMm: 1000,
  itemThicknessMm: 0.1,
  coreOuterDiameterMm: 20,
  callerRadialClearanceMm: 2,
  availableTubeInternalDiametersMm: [20, 30, 40],
} satisfies Input;
export const exampleOutput = {
  uncompressedModelRollOuterDiameterMm: 22.963535321755582,
  minimumCallerTubeInternalDiameterMm: 26.963535321755582,
  selectedTubeInternalDiameterMm: 30,
  availableTubeFound: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/storage-tube-size-selector",
  title: "Rolled Item Diameter Storage Tube Size Selector",
  description:
    "Select from measured tube interior diameters using area-conserving uncompressed roll around declared core and radial clearance; no safe bend radius, interlayer gaps or conservation material suitability guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "uncompressedModelRollOuterDiameterMm",
      label: "Uncompressed model roll outer diameter mm",
      kind: "number",
    },
    {
      id: "minimumCallerTubeInternalDiameterMm",
      label: "Minimum caller tube internal diameter mm",
      kind: "number",
    },
    {
      id: "selectedTubeInternalDiameterMm",
      label: "Selected tube internal diameter mm",
      kind: "number",
    },
    {
      id: "availableTubeFound",
      label: "Available tube found",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      rolledItemLengthMm: value.rolledItemLengthMm as number,
      itemThicknessMm: value.itemThicknessMm as number,
      coreOuterDiameterMm: value.coreOuterDiameterMm as number,
      callerRadialClearanceMm: value.callerRadialClearanceMm as number,
      availableTubeInternalDiametersMm:
        value.availableTubeInternalDiametersMm as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

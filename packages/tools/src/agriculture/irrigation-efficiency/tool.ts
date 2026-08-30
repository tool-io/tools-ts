import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly appliedIrrigationVolumeM3: number;
  readonly rootZoneStoredVolumeM3: number;
  readonly runoffVolumeM3: number;
  readonly deepDrainageVolumeM3: number;
}>;
export type Output = Readonly<{
  readonly measuredStorageEfficiency: number;
  readonly unaccountedAppliedVolumeM3: number;
  readonly measuredRunoffFraction: number;
  readonly measuredDrainageFraction: number;
}>;
const inputFields = [
  {
    id: "appliedIrrigationVolumeM3",
    label: "Applied irrigation volume m3",
    kind: "number",
  },
  {
    id: "rootZoneStoredVolumeM3",
    label: "Root zone stored volume m3",
    kind: "number",
  },
  { id: "runoffVolumeM3", label: "Runoff volume m3", kind: "number" },
  {
    id: "deepDrainageVolumeM3",
    label: "Deep drainage volume m3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.appliedIrrigationVolumeM3, "appliedIrrigationVolumeM3");
  nonnegative(input.rootZoneStoredVolumeM3, "rootZoneStoredVolumeM3");
  nonnegative(input.runoffVolumeM3, "runoffVolumeM3");
  nonnegative(input.deepDrainageVolumeM3, "deepDrainageVolumeM3");
  const accounted =
    input.rootZoneStoredVolumeM3 +
    input.runoffVolumeM3 +
    input.deepDrainageVolumeM3;
  if (accounted > input.appliedIrrigationVolumeM3)
    simpleError("balance", "Accounted fractions cannot exceed applied water.");
  return {
    measuredStorageEfficiency:
      input.rootZoneStoredVolumeM3 / input.appliedIrrigationVolumeM3,
    unaccountedAppliedVolumeM3: input.appliedIrrigationVolumeM3 - accounted,
    measuredRunoffFraction:
      input.runoffVolumeM3 / input.appliedIrrigationVolumeM3,
    measuredDrainageFraction:
      input.deepDrainageVolumeM3 / input.appliedIrrigationVolumeM3,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  appliedIrrigationVolumeM3: 100,
  rootZoneStoredVolumeM3: 60,
  runoffVolumeM3: 10,
  deepDrainageVolumeM3: 20,
} satisfies Input;
export const exampleOutput = {
  measuredStorageEfficiency: 0.6,
  unaccountedAppliedVolumeM3: 10,
  measuredRunoffFraction: 0.1,
  measuredDrainageFraction: 0.2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/irrigation-efficiency",
  title: "Agriculture Irrigation Efficiency",
  description:
    "Audit independently measured applied/storage/runoff/drainage water balance, leaving unaccounted water explicit rather than calling all loss evaporation; not a uniformity or pump efficiency alias.",
  inputs: inputFields,
  outputs: [
    {
      id: "measuredStorageEfficiency",
      label: "Measured storage efficiency",
      kind: "number",
    },
    {
      id: "unaccountedAppliedVolumeM3",
      label: "Unaccounted applied volume m3",
      kind: "number",
    },
    {
      id: "measuredRunoffFraction",
      label: "Measured runoff fraction",
      kind: "number",
    },
    {
      id: "measuredDrainageFraction",
      label: "Measured drainage fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      appliedIrrigationVolumeM3: value.appliedIrrigationVolumeM3 as number,
      rootZoneStoredVolumeM3: value.rootZoneStoredVolumeM3 as number,
      runoffVolumeM3: value.runoffVolumeM3 as number,
      deepDrainageVolumeM3: value.deepDrainageVolumeM3 as number,
    }),
});
export const run = tool.execute;
export default tool;

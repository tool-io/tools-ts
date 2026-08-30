import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly preHarvestCropMassKg: number;
  readonly collectedCropMassKg: number;
  readonly measuredGroundLossMassKg: number;
  readonly measuredResidualOnVineMassKg: number;
}>;
export type Output = Readonly<{
  readonly observedCollectedCropPercent: number;
  readonly measuredGroundPlusResidualLossPercent: number;
  readonly signedUnaccountedCropMassKg: number;
}>;
const inputFields = [
  {
    id: "preHarvestCropMassKg",
    label: "Pre harvest crop mass kg",
    kind: "number",
  },
  {
    id: "collectedCropMassKg",
    label: "Collected crop mass kg",
    kind: "number",
  },
  {
    id: "measuredGroundLossMassKg",
    label: "Measured ground loss mass kg",
    kind: "number",
  },
  {
    id: "measuredResidualOnVineMassKg",
    label: "Measured residual on vine mass kg",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.preHarvestCropMassKg, "preHarvestCropMassKg");
  nonnegative(input.collectedCropMassKg, "collectedCropMassKg");
  nonnegative(input.measuredGroundLossMassKg, "measuredGroundLossMassKg");
  nonnegative(
    input.measuredResidualOnVineMassKg,
    "measuredResidualOnVineMassKg",
  );
  return {
    observedCollectedCropPercent:
      (100 * input.collectedCropMassKg) / input.preHarvestCropMassKg,
    measuredGroundPlusResidualLossPercent:
      (100 *
        (input.measuredGroundLossMassKg + input.measuredResidualOnVineMassKg)) /
      input.preHarvestCropMassKg,
    signedUnaccountedCropMassKg:
      input.preHarvestCropMassKg -
      input.collectedCropMassKg -
      input.measuredGroundLossMassKg -
      input.measuredResidualOnVineMassKg,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  preHarvestCropMassKg: 1000,
  collectedCropMassKg: 800,
  measuredGroundLossMassKg: 100,
  measuredResidualOnVineMassKg: 50,
} satisfies Input;
export const exampleOutput = {
  observedCollectedCropPercent: 80,
  measuredGroundPlusResidualLossPercent: 15,
  signedUnaccountedCropMassKg: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/machine-harvest-loss-percent",
  title: "Machine Harvest Loss Percent",
  description:
    "Audit independent preharvest/collected/ground/residual crop inventories, preserving signed unaccounted mismatch instead of forcing mass closure or calling every residual machine loss.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedCollectedCropPercent",
      label: "Observed collected crop percent",
      kind: "number",
    },
    {
      id: "measuredGroundPlusResidualLossPercent",
      label: "Measured ground plus residual loss percent",
      kind: "number",
    },
    {
      id: "signedUnaccountedCropMassKg",
      label: "Signed unaccounted crop mass kg",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      preHarvestCropMassKg: value.preHarvestCropMassKg as number,
      collectedCropMassKg: value.collectedCropMassKg as number,
      measuredGroundLossMassKg: value.measuredGroundLossMassKg as number,
      measuredResidualOnVineMassKg:
        value.measuredResidualOnVineMassKg as number,
    }),
});
export const run = tool.execute;
export default tool;

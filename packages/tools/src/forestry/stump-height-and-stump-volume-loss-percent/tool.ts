import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly stumpHeightsM: readonly number[];
  readonly groundDiametersM: readonly number[];
  readonly cutDiametersM: readonly number[];
  readonly deliveredLogVolumesM3: readonly number[];
}>;
export type Output = Readonly<{
  readonly stumpEnvelopeVolumeM3: number;
  readonly stumpFractionOfStumpPlusDeliveredVolume: number;
}>;
const inputFields = [
  { id: "stumpHeightsM", label: "Stump heights m", kind: "numberList" },
  { id: "groundDiametersM", label: "Ground diameters m", kind: "numberList" },
  { id: "cutDiametersM", label: "Cut diameters m", kind: "numberList" },
  {
    id: "deliveredLogVolumesM3",
    label: "Delivered log volumes m3",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.stumpHeightsM.forEach((v) => nonnegative(v, "stumpHeightsM"));
  input.groundDiametersM.forEach((v) => nonnegative(v, "groundDiametersM"));
  input.cutDiametersM.forEach((v) => nonnegative(v, "cutDiametersM"));
  input.deliveredLogVolumesM3.forEach((v) =>
    nonnegative(v, "deliveredLogVolumesM3"),
  );
  aligned(input.stumpHeightsM, input.groundDiametersM, "stumpHeightsM");
  aligned(input.stumpHeightsM, input.cutDiametersM, "stumpHeightsM");
  aligned(input.stumpHeightsM, input.deliveredLogVolumesM3, "stumpHeightsM");
  const stumpEnvelopeVolumeM3 = input.stumpHeightsM.reduce((s, h, i) => {
      const a = input.groundDiametersM[i],
        b = input.cutDiametersM[i];
      return s + (Math.PI * h * (a * a + a * b + b * b)) / 12;
    }, 0),
    total = positive(
      stumpEnvelopeVolumeM3 +
        input.deliveredLogVolumesM3.reduce((a, b) => a + b, 0),
      "accountedVolume",
    );
  return {
    stumpEnvelopeVolumeM3,
    stumpFractionOfStumpPlusDeliveredVolume: stumpEnvelopeVolumeM3 / total,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  stumpHeightsM: [1, 1],
  groundDiametersM: [1, 1],
  cutDiametersM: [1, 0.5],
  deliveredLogVolumesM3: [2, 3],
} satisfies Input;
export const exampleOutput = {
  stumpEnvelopeVolumeM3: 1.2435470920459597,
  stumpFractionOfStumpPlusDeliveredVolume: 0.19917317411286783,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/stump-height-and-stump-volume-loss-percent",
  title: "Stump Volume Loss Percent",
  description:
    "Inventory stump frustum envelopes and loss fraction on explicitly accounted stump+delivered log volume; unmeasured tops/defects are excluded, not asserted total biological harvest loss.",
  inputs: inputFields,
  outputs: [
    {
      id: "stumpEnvelopeVolumeM3",
      label: "Stump envelope volume m3",
      kind: "number",
    },
    {
      id: "stumpFractionOfStumpPlusDeliveredVolume",
      label: "Stump fraction of stump plus delivered volume",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      stumpHeightsM: value.stumpHeightsM as readonly number[],
      groundDiametersM: value.groundDiametersM as readonly number[],
      cutDiametersM: value.cutDiametersM as readonly number[],
      deliveredLogVolumesM3: value.deliveredLogVolumesM3 as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

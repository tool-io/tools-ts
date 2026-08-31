import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch32-shared.js";
export type Input = Readonly<{
  readonly oxygenSaturationMgLiter: number;
  readonly initialOxygenMgLiter: number;
  readonly reaerationCoefficientPerDay: number;
  readonly elapsedDays: number;
  readonly waterVolumeM3: number;
}>;
export type Output = Readonly<{
  readonly modeledFinalOxygenMgLiter: number;
  readonly signedTransferredOxygenKg: number;
}>;
const inputFields = [
  {
    id: "oxygenSaturationMgLiter",
    label: "Oxygen saturation mg liter",
    kind: "number",
  },
  {
    id: "initialOxygenMgLiter",
    label: "Initial oxygen mg liter",
    kind: "number",
  },
  {
    id: "reaerationCoefficientPerDay",
    label: "Reaeration coefficient per day",
    kind: "number",
  },
  { id: "elapsedDays", label: "Elapsed days", kind: "number" },
  { id: "waterVolumeM3", label: "Water volume m3", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.oxygenSaturationMgLiter, "oxygenSaturationMgLiter");
  nonnegative(input.initialOxygenMgLiter, "initialOxygenMgLiter");
  nonnegative(input.reaerationCoefficientPerDay, "reaerationCoefficientPerDay");
  nonnegative(input.elapsedDays, "elapsedDays");
  nonnegative(input.waterVolumeM3, "waterVolumeM3");
  const transferred =
      (input.oxygenSaturationMgLiter - input.initialOxygenMgLiter) *
      -Math.expm1(-input.reaerationCoefficientPerDay * input.elapsedDays),
    final = input.initialOxygenMgLiter + transferred;
  return {
    modeledFinalOxygenMgLiter: final,
    signedTransferredOxygenKg: (transferred * input.waterVolumeM3) / 1000,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  oxygenSaturationMgLiter: 10,
  initialOxygenMgLiter: 2,
  reaerationCoefficientPerDay: 0.5,
  elapsedDays: 2,
  waterVolumeM3: 1000,
} satisfies Input;
export const exampleOutput = {
  modeledFinalOxygenMgLiter: 7.056964470628461,
  signedTransferredOxygenKg: 5.056964470628461,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/reaeration-coefficient-oxygen-transfer",
  title: "Reaeration Coefficient Oxygen Transfer Calculator",
  description:
    "Integrate constant first-order reaeration toward caller saturation reference with exact exponential and signed supersaturated degassing; no respiration, variable volume, field transfer-efficiency or gas-supply sizing.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledFinalOxygenMgLiter",
      label: "Modeled final oxygen mg liter",
      kind: "number",
    },
    {
      id: "signedTransferredOxygenKg",
      label: "Signed transferred oxygen kg",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      oxygenSaturationMgLiter: value.oxygenSaturationMgLiter as number,
      initialOxygenMgLiter: value.initialOxygenMgLiter as number,
      reaerationCoefficientPerDay: value.reaerationCoefficientPerDay as number,
      elapsedDays: value.elapsedDays as number,
      waterVolumeM3: value.waterVolumeM3 as number,
    }),
});
export const run = tool.execute;
export default tool;

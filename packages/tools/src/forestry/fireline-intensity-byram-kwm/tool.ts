import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly effectiveHeatYieldKjPerKg: number;
  readonly consumedFuelDryKgPerM2: number;
  readonly fireFrontSpreadMPerSecond: number;
}>;
export type Output = Readonly<{
  readonly byramFirelineIntensityKwPerM: number;
}>;
const inputFields = [
  {
    id: "effectiveHeatYieldKjPerKg",
    label: "Effective heat yield kj per kg",
    kind: "number",
  },
  {
    id: "consumedFuelDryKgPerM2",
    label: "Consumed fuel dry kg per m2",
    kind: "number",
  },
  {
    id: "fireFrontSpreadMPerSecond",
    label: "Fire front spread m per second",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.effectiveHeatYieldKjPerKg, "effectiveHeatYieldKjPerKg");
  nonnegative(input.consumedFuelDryKgPerM2, "consumedFuelDryKgPerM2");
  nonnegative(input.fireFrontSpreadMPerSecond, "fireFrontSpreadMPerSecond");
  return {
    byramFirelineIntensityKwPerM:
      input.effectiveHeatYieldKjPerKg *
      input.consumedFuelDryKgPerM2 *
      input.fireFrontSpreadMPerSecond,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  effectiveHeatYieldKjPerKg: 10000,
  consumedFuelDryKgPerM2: 0.5,
  fireFrontSpreadMPerSecond: 0.1,
} satisfies Input;
export const exampleOutput = {
  byramFirelineIntensityKwPerM: 500,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/fireline-intensity-byram-kwm",
  title: "Byram Fireline Intensity kW/m",
  description:
    "Compute Byram heat-yield×consumed-fuel×front-spread fireline intensity using supplied dry fuel consumption, not full fuel load or a fire-danger/response recommendation.",
  inputs: inputFields,
  outputs: [
    {
      id: "byramFirelineIntensityKwPerM",
      label: "Byram fireline intensity kw per m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      effectiveHeatYieldKjPerKg: value.effectiveHeatYieldKjPerKg as number,
      consumedFuelDryKgPerM2: value.consumedFuelDryKgPerM2 as number,
      fireFrontSpreadMPerSecond: value.fireFrontSpreadMPerSecond as number,
    }),
});
export const run = tool.execute;
export default tool;

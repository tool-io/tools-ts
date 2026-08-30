import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly deepWaterWaveHeightM: number;
  readonly deepWaterWavelengthM: number;
  readonly foreshoreSlopeTangent: number;
  readonly observedStillWaterLevelM: number;
}>;
export type Output = Readonly<{
  readonly stockdonTwoPercentRunupM: number;
  readonly modelTotalWaterLevelM: number;
}>;
const inputFields = [
  {
    id: "deepWaterWaveHeightM",
    label: "Deep water wave height m",
    kind: "number",
  },
  {
    id: "deepWaterWavelengthM",
    label: "Deep water wavelength m",
    kind: "number",
  },
  {
    id: "foreshoreSlopeTangent",
    label: "Foreshore slope tangent",
    kind: "number",
  },
  {
    id: "observedStillWaterLevelM",
    label: "Observed still water level m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.deepWaterWavelengthM, "deepWaterWavelengthM");
  nonnegative(input.deepWaterWaveHeightM, "deepWaterWaveHeightM");
  nonnegative(input.foreshoreSlopeTangent, "foreshoreSlopeTangent");
  const hL = input.deepWaterWaveHeightM * input.deepWaterWavelengthM,
    b = input.foreshoreSlopeTangent,
    stockdonTwoPercentRunupM =
      1.1 *
      (0.35 * b * Math.sqrt(hL) +
        0.5 * Math.sqrt(hL * (0.563 * b * b + 0.004)));
  return {
    stockdonTwoPercentRunupM,
    modelTotalWaterLevelM:
      input.observedStillWaterLevelM + stockdonTwoPercentRunupM,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  deepWaterWaveHeightM: 1,
  deepWaterWavelengthM: 100,
  foreshoreSlopeTangent: 0.1,
  observedStillWaterLevelM: 2,
} satisfies Input;
export const exampleOutput = {
  stockdonTwoPercentRunupM: 0.9247290987152721,
  modelTotalWaterLevelM: 2.924729098715272,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/runup-stockdon-total",
  title: "Runup Stockdon Total",
  description:
    "Evaluate the empirical Stockdon 2006 general-beach R2 formulation and add supplied still water; not a dune overtopping probability, tsunami model or guaranteed maximum.",
  inputs: inputFields,
  outputs: [
    {
      id: "stockdonTwoPercentRunupM",
      label: "Stockdon two percent runup m",
      kind: "number",
    },
    {
      id: "modelTotalWaterLevelM",
      label: "Model total water level m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      deepWaterWaveHeightM: value.deepWaterWaveHeightM as number,
      deepWaterWavelengthM: value.deepWaterWavelengthM as number,
      foreshoreSlopeTangent: value.foreshoreSlopeTangent as number,
      observedStillWaterLevelM: value.observedStillWaterLevelM as number,
    }),
});
export const run = tool.execute;
export default tool;

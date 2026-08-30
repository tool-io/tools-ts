import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";

export type Input = Readonly<{
  readonly doublingForcingWPerM2: number;
  readonly restoringFeedbackWPerM2K: number;
  readonly heatCapacityWYearPerM2K: number;
  readonly co2DoublingTimeYears: number;
}>;
export type Output = Readonly<{
  readonly oneBoxResponseTimeYears: number;
  readonly equilibriumDoublingResponseK: number;
  readonly oneBoxTransientDoublingResponseK: number;
}>;
const inputFields = [
  {
    id: "doublingForcingWPerM2",
    label: "Doubling forcing w per m2",
    kind: "number",
  },
  {
    id: "restoringFeedbackWPerM2K",
    label: "Restoring feedback w per m2 k",
    kind: "number",
  },
  {
    id: "heatCapacityWYearPerM2K",
    label: "Heat capacity w year per m2 k",
    kind: "number",
  },
  {
    id: "co2DoublingTimeYears",
    label: "Co2 doubling time years",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.restoringFeedbackWPerM2K, "restoringFeedbackWPerM2K");
  positive(input.heatCapacityWYearPerM2K, "heatCapacityWYearPerM2K");
  positive(input.co2DoublingTimeYears, "co2DoublingTimeYears");
  const oneBoxResponseTimeYears =
      input.heatCapacityWYearPerM2K / input.restoringFeedbackWPerM2K,
    equilibriumDoublingResponseK =
      input.doublingForcingWPerM2 / input.restoringFeedbackWPerM2K,
    x = input.co2DoublingTimeYears / oneBoxResponseTimeYears,
    factor =
      x < 1e-5
        ? x / 2 - (x * x) / 6 + (x * x * x) / 24
        : 1 + Math.expm1(-x) / x;
  return {
    oneBoxResponseTimeYears,
    equilibriumDoublingResponseK,
    oneBoxTransientDoublingResponseK: equilibriumDoublingResponseK * factor,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  doublingForcingWPerM2: 4,
  restoringFeedbackWPerM2K: 2,
  heatCapacityWYearPerM2K: 20,
  co2DoublingTimeYears: 10,
} satisfies Input;
export const exampleOutput = {
  oneBoxResponseTimeYears: 10,
  equilibriumDoublingResponseK: 2,
  oneBoxTransientDoublingResponseK: 0.7357588823428847,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/tcr-estimator",
  title: "Transient Climate Response TCR Estimator",
  description:
    "Evaluate one-box transient response at end of a linear forcing ramp (exponential CO2 growth under logarithmic forcing), with explicit restoring feedback/heat capacity/time and stable short-ramp limit; not observed TCR.",
  inputs: inputFields,
  outputs: [
    {
      id: "oneBoxResponseTimeYears",
      label: "One box response time years",
      kind: "number",
    },
    {
      id: "equilibriumDoublingResponseK",
      label: "Equilibrium doubling response k",
      kind: "number",
    },
    {
      id: "oneBoxTransientDoublingResponseK",
      label: "One box transient doubling response k",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      doublingForcingWPerM2: value.doublingForcingWPerM2 as number,
      restoringFeedbackWPerM2K: value.restoringFeedbackWPerM2K as number,
      heatCapacityWYearPerM2K: value.heatCapacityWYearPerM2K as number,
      co2DoublingTimeYears: value.co2DoublingTimeYears as number,
    }),
});
export const run = tool.execute;
export default tool;

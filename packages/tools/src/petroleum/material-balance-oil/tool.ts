import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  finite,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedProducedStockOilM3: number;
  readonly observedTotalProducedGasPerOilStockRatio: number;
  readonly callerCurrentSolutionGasOilRatio: number;
  readonly callerInitialSolutionGasOilRatio: number;
  readonly callerCurrentOilFvf: number;
  readonly callerInitialOilFvf: number;
  readonly callerCurrentGasFvf: number;
  readonly observedProducedStockWaterM3: number;
  readonly callerWaterFvf: number;
  readonly callerIndependentWaterInfluxReservoirM3: number;
}>;
export type Output = Readonly<{
  readonly reducedOilMaterialBalanceOriginalStockOilM3: number;
}>;
const inputFields = [
  {
    id: "observedProducedStockOilM3",
    label: "Observed produced stock oil m3",
    kind: "number",
  },
  {
    id: "observedTotalProducedGasPerOilStockRatio",
    label: "Observed total produced gas per oil stock ratio",
    kind: "number",
  },
  {
    id: "callerCurrentSolutionGasOilRatio",
    label: "Caller current solution gas oil ratio",
    kind: "number",
  },
  {
    id: "callerInitialSolutionGasOilRatio",
    label: "Caller initial solution gas oil ratio",
    kind: "number",
  },
  {
    id: "callerCurrentOilFvf",
    label: "Caller current oil fvf",
    kind: "number",
  },
  {
    id: "callerInitialOilFvf",
    label: "Caller initial oil fvf",
    kind: "number",
  },
  {
    id: "callerCurrentGasFvf",
    label: "Caller current gas fvf",
    kind: "number",
  },
  {
    id: "observedProducedStockWaterM3",
    label: "Observed produced stock water m3",
    kind: "number",
  },
  { id: "callerWaterFvf", label: "Caller water fvf", kind: "number" },
  {
    id: "callerIndependentWaterInfluxReservoirM3",
    label: "Caller independent water influx reservoir m3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerCurrentOilFvf, "callerCurrentOilFvf");
  positive(input.callerInitialOilFvf, "callerInitialOilFvf");
  positive(input.callerCurrentGasFvf, "callerCurrentGasFvf");
  positive(input.callerWaterFvf, "callerWaterFvf");
  nonnegative(input.observedProducedStockOilM3, "observedProducedStockOilM3");
  nonnegative(
    input.observedTotalProducedGasPerOilStockRatio,
    "observedTotalProducedGasPerOilStockRatio",
  );
  nonnegative(
    input.callerCurrentSolutionGasOilRatio,
    "callerCurrentSolutionGasOilRatio",
  );
  nonnegative(
    input.callerInitialSolutionGasOilRatio,
    "callerInitialSolutionGasOilRatio",
  );
  nonnegative(
    input.observedProducedStockWaterM3,
    "observedProducedStockWaterM3",
  );
  nonnegative(
    input.callerIndependentWaterInfluxReservoirM3,
    "callerIndependentWaterInfluxReservoirM3",
  );
  const expansion = finite(
    input.callerCurrentOilFvf -
      input.callerInitialOilFvf +
      (input.callerInitialSolutionGasOilRatio -
        input.callerCurrentSolutionGasOilRatio) *
        input.callerCurrentGasFvf,
  );
  positive(expansion, "oil/gas expansion");
  const withdrawal = finite(
    input.observedProducedStockOilM3 *
      (input.callerCurrentOilFvf +
        (input.observedTotalProducedGasPerOilStockRatio -
          input.callerCurrentSolutionGasOilRatio) *
          input.callerCurrentGasFvf) +
      input.observedProducedStockWaterM3 * input.callerWaterFvf -
      input.callerIndependentWaterInfluxReservoirM3,
  );
  return {
    reducedOilMaterialBalanceOriginalStockOilM3: withdrawal / expansion,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedProducedStockOilM3: 10,
  observedTotalProducedGasPerOilStockRatio: 2,
  callerCurrentSolutionGasOilRatio: 1,
  callerInitialSolutionGasOilRatio: 2,
  callerCurrentOilFvf: 2,
  callerInitialOilFvf: 1,
  callerCurrentGasFvf: 0.1,
  observedProducedStockWaterM3: 3,
  callerWaterFvf: 1,
  callerIndependentWaterInfluxReservoirM3: 5,
} satisfies Input;
export const exampleOutput = {
  reducedOilMaterialBalanceOriginalStockOilM3: 17.27272727272727,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/material-balance-oil",
  title: "Petroleum Material Balance Oil Calculator",
  description:
    "Explicit reduced solution-gas oil balance N=(Np[Bo+(Rp−Rs) Bg]+WpBw−We)/[Bo−Boi+(Rsi−Rs) Bg], no gas-cap, injection or rock/water compressibility terms; caller matches reservoir/stock units, signed inconsistency retained. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "reducedOilMaterialBalanceOriginalStockOilM3",
      label: "Reduced oil material balance original stock oil m3",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedProducedStockOilM3: value.observedProducedStockOilM3 as number,
      observedTotalProducedGasPerOilStockRatio:
        value.observedTotalProducedGasPerOilStockRatio as number,
      callerCurrentSolutionGasOilRatio:
        value.callerCurrentSolutionGasOilRatio as number,
      callerInitialSolutionGasOilRatio:
        value.callerInitialSolutionGasOilRatio as number,
      callerCurrentOilFvf: value.callerCurrentOilFvf as number,
      callerInitialOilFvf: value.callerInitialOilFvf as number,
      callerCurrentGasFvf: value.callerCurrentGasFvf as number,
      observedProducedStockWaterM3:
        value.observedProducedStockWaterM3 as number,
      callerWaterFvf: value.callerWaterFvf as number,
      callerIndependentWaterInfluxReservoirM3:
        value.callerIndependentWaterInfluxReservoirM3 as number,
    }),
});
export const run = tool.execute;
export default tool;

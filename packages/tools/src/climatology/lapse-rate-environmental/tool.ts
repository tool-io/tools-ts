import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  ordered,
  regression,
} from "../shared.js";

export type Input = Readonly<{
  readonly observedHeightsM: readonly number[];
  readonly observedTemperaturesC: readonly number[];
  readonly predictionHeightM: number;
}>;
export type Output = Readonly<{
  readonly fittedEnvironmentalLapseCPerKm: number;
  readonly predictedProfileTemperatureC: number;
  readonly predictionOutsideObservedHeightRange: boolean;
}>;
const inputFields = [
  { id: "observedHeightsM", label: "Observed heights m", kind: "numberList" },
  {
    id: "observedTemperaturesC",
    label: "Observed temperatures c",
    kind: "numberList",
  },
  { id: "predictionHeightM", label: "Prediction height m", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedHeightsM,
    input.observedTemperaturesC,
    "observedHeightsM",
  );
  ordered(input.observedHeightsM, "heights");
  const fit = regression(input.observedHeightsM, input.observedTemperaturesC);
  return {
    fittedEnvironmentalLapseCPerKm: -1000 * fit.slope,
    predictedProfileTemperatureC:
      fit.intercept + fit.slope * input.predictionHeightM,
    predictionOutsideObservedHeightRange:
      input.predictionHeightM < input.observedHeightsM[0] ||
      input.predictionHeightM > input.observedHeightsM.at(-1)!,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedHeightsM: [0, 1000, 2000],
  observedTemperaturesC: [20, 14, 8],
  predictionHeightM: 3000,
} satisfies Input;
export const exampleOutput = {
  fittedEnvironmentalLapseCPerKm: 6,
  predictedProfileTemperatureC: 2,
  predictionOutsideObservedHeightRange: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/lapse-rate-environmental",
  title: "Lapse Rate Environmental",
  description:
    "Fit measured environmental temperature profile and expose extrapolated-height predictions, retaining inversion sign; not a prescribed constant atmosphere or pressure/altitude conversion.",
  inputs: inputFields,
  outputs: [
    {
      id: "fittedEnvironmentalLapseCPerKm",
      label: "Fitted environmental lapse c per km",
      kind: "number",
    },
    {
      id: "predictedProfileTemperatureC",
      label: "Predicted profile temperature c",
      kind: "number",
    },
    {
      id: "predictionOutsideObservedHeightRange",
      label: "Prediction outside observed height range",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedHeightsM: value.observedHeightsM as readonly number[],
      observedTemperaturesC: value.observedTemperaturesC as readonly number[],
      predictionHeightM: value.predictionHeightM as number,
    }),
});
export const run = tool.execute;
export default tool;

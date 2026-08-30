import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../shared.js";
export type Input = Readonly<{
  readonly baselineElaM: number;
  readonly temperatureChangeC: number;
  readonly precipitationChangeFraction: number;
  readonly temperatureSensitivityMetersPerC: number;
  readonly precipitationSensitivityMetersPerFraction: number;
}>;
export type Output = Readonly<{
  readonly predictedElaChangeM: number;
  readonly predictedElaM: number;
}>;
const inputFields = [
  { id: "baselineElaM", label: "Baseline ela m", kind: "number" },
  { id: "temperatureChangeC", label: "Temperature change c", kind: "number" },
  {
    id: "precipitationChangeFraction",
    label: "Precipitation change fraction",
    kind: "number",
  },
  {
    id: "temperatureSensitivityMetersPerC",
    label: "Temperature sensitivity meters per c",
    kind: "number",
  },
  {
    id: "precipitationSensitivityMetersPerFraction",
    label: "Precipitation sensitivity meters per fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.precipitationChangeFraction < -1)
    simpleError(
      "precipitationChangeFraction",
      "Precipitation cannot decline by more than 100 percent.",
    );
  const predictedElaChangeM =
    input.temperatureChangeC * input.temperatureSensitivityMetersPerC +
    input.precipitationChangeFraction *
      input.precipitationSensitivityMetersPerFraction;
  return {
    predictedElaChangeM,
    predictedElaM: input.baselineElaM + predictedElaChangeM,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  baselineElaM: 2000,
  temperatureChangeC: 1,
  precipitationChangeFraction: 0.1,
  temperatureSensitivityMetersPerC: 100,
  precipitationSensitivityMetersPerFraction: -200,
} satisfies Input;
export const exampleOutput = {
  predictedElaChangeM: 80,
  predictedElaM: 2080,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/ela-depression-climate-warming",
  title: "ELA Depression Climate Warming",
  description:
    "Evaluate a supplied linear temperature/precipitation ELA perturbation model; signed changes and calibration coefficients are retained, not a universal climate lapse-rate rule.",
  inputs: inputFields,
  outputs: [
    {
      id: "predictedElaChangeM",
      label: "Predicted ela change m",
      kind: "number",
    },
    { id: "predictedElaM", label: "Predicted ela m", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      baselineElaM: value.baselineElaM as number,
      temperatureChangeC: value.temperatureChangeC as number,
      precipitationChangeFraction: value.precipitationChangeFraction as number,
      temperatureSensitivityMetersPerC:
        value.temperatureSensitivityMetersPerC as number,
      precipitationSensitivityMetersPerFraction:
        value.precipitationSensitivityMetersPerFraction as number,
    }),
});
export const run = tool.execute;
export default tool;

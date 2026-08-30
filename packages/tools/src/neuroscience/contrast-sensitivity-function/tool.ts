import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
  aligned,
  ordered,
  integral,
} from "../shared.js";
export type Input = Readonly<{
  readonly spatialFrequenciesCyclesPerDegree: readonly number[];
  readonly michelsonThresholds: readonly number[];
}>;
export type Output = Readonly<{
  readonly sensitivities: readonly number[];
  readonly logFrequencyLogSensitivityArea: number;
}>;
const inputFields = [
  {
    id: "spatialFrequenciesCyclesPerDegree",
    label: "Spatial frequencies cycles per degree",
    kind: "numberList",
  },
  {
    id: "michelsonThresholds",
    label: "Michelson thresholds",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.spatialFrequenciesCyclesPerDegree,
    input.michelsonThresholds,
    "spatialFrequenciesCyclesPerDegree",
  );
  ordered(
    input.spatialFrequenciesCyclesPerDegree,
    "spatialFrequenciesCyclesPerDegree",
  );
  input.spatialFrequenciesCyclesPerDegree.forEach((v) =>
    positive(v, "spatialFrequenciesCyclesPerDegree"),
  );
  input.michelsonThresholds.forEach((v) => {
    positive(v, "michelsonThresholds");
    fraction(v, "michelsonThresholds");
  });
  const sensitivities = input.michelsonThresholds.map((v) => 1 / v);
  return {
    sensitivities,
    logFrequencyLogSensitivityArea: integral(
      input.spatialFrequenciesCyclesPerDegree.map(Math.log10),
      sensitivities.map(Math.log10),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  spatialFrequenciesCyclesPerDegree: [1, 2, 4],
  michelsonThresholds: [0.1, 0.05, 0.1],
} satisfies Input;
export const exampleOutput = {
  sensitivities: [10, 20, 10],
  logFrequencyLogSensitivityArea: 0.692679049617419,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/contrast-sensitivity-function",
  title: "Contrast Sensitivity",
  description:
    "Build a contrast-sensitivity function and trapezoidal area in log10 frequency/log10 sensitivity space from measured Michelson thresholds.",
  inputs: inputFields,
  outputs: [
    { id: "sensitivities", label: "Sensitivities", kind: "numberList" },
    {
      id: "logFrequencyLogSensitivityArea",
      label: "Log frequency log sensitivity area",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      spatialFrequenciesCyclesPerDegree:
        value.spatialFrequenciesCyclesPerDegree as readonly number[],
      michelsonThresholds: value.michelsonThresholds as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

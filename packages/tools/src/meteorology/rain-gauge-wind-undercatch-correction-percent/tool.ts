import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedGaugeRainMm: number;
  readonly independentCatchEfficiency: number;
}>;
export type Output = Readonly<{
  readonly correctedRainMm: number;
  readonly correctionRelativeObservedPercent: number;
}>;
const inputFields = [
  {
    id: "observedGaugeRainMm",
    label: "Observed gauge rain mm",
    kind: "number",
  },
  {
    id: "independentCatchEfficiency",
    label: "Independent catch efficiency",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.independentCatchEfficiency, "independentCatchEfficiency");
  nonnegative(input.observedGaugeRainMm, "observedGaugeRainMm");
  fraction(input.independentCatchEfficiency, "efficiency");
  return {
    correctedRainMm:
      input.observedGaugeRainMm / input.independentCatchEfficiency,
    correctionRelativeObservedPercent:
      100 * (1 / input.independentCatchEfficiency - 1),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedGaugeRainMm: 8,
  independentCatchEfficiency: 0.8,
} satisfies Input;
export const exampleOutput = {
  correctedRainMm: 10,
  correctionRelativeObservedPercent: 25,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/rain-gauge-wind-undercatch-correction-percent",
  title: "Rain Gauge Wind Undercatch Correction Percent Calculator",
  description:
    "Independent wind-catch calibrated correction observed/efficiency and percent relative to observed, not constant rain gauge bias or weather inference. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    { id: "correctedRainMm", label: "Corrected rain mm", kind: "number" },
    {
      id: "correctionRelativeObservedPercent",
      label: "Correction relative observed percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedGaugeRainMm: value.observedGaugeRainMm as number,
      independentCatchEfficiency: value.independentCatchEfficiency as number,
    }),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  regression,
} from "../shared.js";
export type Input = Readonly<{
  readonly trophicLevels: readonly number[];
  readonly lipidNormalizedConcentrations: readonly number[];
}>;
export type Output = Readonly<{
  readonly logConcentrationSlopePerTrophicLevel: number;
  readonly trophicMagnificationFactor: number;
  readonly fitRSquared: number;
}>;
const inputFields = [
  { id: "trophicLevels", label: "Trophic levels", kind: "numberList" },
  {
    id: "lipidNormalizedConcentrations",
    label: "Lipid normalized concentrations",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.trophicLevels,
    input.lipidNormalizedConcentrations,
    "trophicLevels",
  );
  input.trophicLevels.forEach((v) => positive(v, "trophicLevels"));
  input.lipidNormalizedConcentrations.forEach((v) =>
    positive(v, "lipidNormalizedConcentrations"),
  );
  const fit = regression(
    input.trophicLevels,
    input.lipidNormalizedConcentrations.map(Math.log),
  );
  return {
    logConcentrationSlopePerTrophicLevel: fit.slope,
    trophicMagnificationFactor: Math.exp(fit.slope),
    fitRSquared: fit.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  trophicLevels: [1, 2, 3],
  lipidNormalizedConcentrations: [2, 4, 8],
} satisfies Input;
export const exampleOutput = {
  logConcentrationSlopePerTrophicLevel: 0.6931471805599453,
  trophicMagnificationFactor: 2,
  fitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/loglinear-trophic-magnification-factor",
  title: "Trophic Magnification Factor",
  description:
    "Fit natural-log lipid-normalized concentration against caller trophic levels and exponentiate the slope; ratios below one preserve trophic dilution and ecological causality is not inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "logConcentrationSlopePerTrophicLevel",
      label: "Log concentration slope per trophic level",
      kind: "number",
    },
    {
      id: "trophicMagnificationFactor",
      label: "Trophic magnification factor",
      kind: "number",
    },
    { id: "fitRSquared", label: "Fit r squared", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      trophicLevels: value.trophicLevels as readonly number[],
      lipidNormalizedConcentrations:
        value.lipidNormalizedConcentrations as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

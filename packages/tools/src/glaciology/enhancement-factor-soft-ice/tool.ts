import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  mean,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly observedStrainRatesPerYear: readonly number[];
  readonly unEnhancedModeledRatesPerYear: readonly number[];
}>;
export type Output = Readonly<{
  readonly apparentEnhancementFactors: readonly number[];
  readonly geometricMeanApparentEnhancement: number;
}>;
const inputFields = [
  {
    id: "observedStrainRatesPerYear",
    label: "Observed strain rates per year",
    kind: "numberList",
  },
  {
    id: "unEnhancedModeledRatesPerYear",
    label: "Un enhanced modeled rates per year",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedStrainRatesPerYear.forEach((v) =>
    positive(v, "observedStrainRatesPerYear"),
  );
  input.unEnhancedModeledRatesPerYear.forEach((v) =>
    positive(v, "unEnhancedModeledRatesPerYear"),
  );
  aligned(
    input.observedStrainRatesPerYear,
    input.unEnhancedModeledRatesPerYear,
    "observedStrainRatesPerYear",
  );
  const ratios = input.observedStrainRatesPerYear.map(
    (v, i) => v / input.unEnhancedModeledRatesPerYear[i],
  );
  return {
    apparentEnhancementFactors: ratios,
    geometricMeanApparentEnhancement: Math.exp(mean(ratios.map(Math.log))),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedStrainRatesPerYear: [2, 6],
  unEnhancedModeledRatesPerYear: [1, 2],
} satisfies Input;
export const exampleOutput = {
  apparentEnhancementFactors: [2, 3],
  geometricMeanApparentEnhancement: 2.449489742783178,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/enhancement-factor-soft-ice",
  title: "Enhancement Factor Soft Ice Calculator",
  description:
    "Infer apparent multiplicative ice-softening enhancement from paired observed and unenhanced modeled strain rates; the factor absorbs calibration/stress errors and is not a forward Glen law or a unique physical cause.",
  inputs: inputFields,
  outputs: [
    {
      id: "apparentEnhancementFactors",
      label: "Apparent enhancement factors",
      kind: "numberList",
    },
    {
      id: "geometricMeanApparentEnhancement",
      label: "Geometric mean apparent enhancement",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedStrainRatesPerYear:
        value.observedStrainRatesPerYear as readonly number[],
      unEnhancedModeledRatesPerYear:
        value.unEnhancedModeledRatesPerYear as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

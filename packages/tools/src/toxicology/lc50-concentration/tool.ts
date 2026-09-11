import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, logEndpoint } from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualTestedConcentrations: readonly number[];
  readonly independentlyAssessedLethalFractions: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualTestedConcentrations",
    label: "Actual tested concentrations",
    kind: "numberList",
  },
  {
    id: "independentlyAssessedLethalFractions",
    label: "Independently assessed lethal fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    observedLogInterpolatedLc50: logEndpoint(
      input.actualTestedConcentrations,
      input.independentlyAssessedLethalFractions,
      0.5,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualTestedConcentrations: [1, 10, 100],
    independentlyAssessedLethalFractions: [0.25, 0.5, 0.75],
  },
  output: { result: { observedLogInterpolatedLc50: 10 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/lc50-concentration",
  title: "LC50 Concentration Calculator",
  description:
    "Actual independently tested lethal concentration endpoint LC50via piecewise-linear response versus log concentration, no untested extrapolation or model-fit claim. Route/species/exposure duration and assay interpretation external; not LD50mass/bodymass or a safe concentration.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
  aligned,
  sum,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly phaseVolumeFractions: readonly number[];
  readonly phaseRelativePermittivities: readonly number[];
}>;
export type Output = Readonly<{
  readonly crimEffectiveRelativePermittivity: number;
}>;
const inputFields = [
  {
    id: "phaseVolumeFractions",
    label: "Phase volume fractions",
    kind: "numberList",
  },
  {
    id: "phaseRelativePermittivities",
    label: "Phase relative permittivities",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.phaseRelativePermittivities.forEach((v) =>
    positive(v, "phaseRelativePermittivities"),
  );
  input.phaseVolumeFractions.forEach((v) =>
    fraction(v, "phaseVolumeFractions"),
  );
  aligned(
    input.phaseVolumeFractions,
    input.phaseRelativePermittivities,
    "phaseVolumeFractions",
  );
  if (Math.abs(sum(input.phaseVolumeFractions) - 1) > 1e-10)
    simpleError("closure", "Phase fractions sum1, no renormalization.");
  return {
    crimEffectiveRelativePermittivity:
      sum(
        input.phaseVolumeFractions.map(
          (v, i) => v * Math.sqrt(input.phaseRelativePermittivities[i]),
        ),
      ) ** 2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  phaseVolumeFractions: [0.5, 0.5],
  phaseRelativePermittivities: [1, 9],
} satisfies Input;
export const exampleOutput = {
  crimEffectiveRelativePermittivity: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/petrophysical-dielectric-permittivity",
  title: "Geology Petrophysical Dielectric Permittivity Calculator",
  description:
    "CRIM square-root volumetric dielectric mixing with independently measured same-frequency phases; not lithology identity or DC conductivity. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "crimEffectiveRelativePermittivity",
      label: "Crim effective relative permittivity",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      phaseVolumeFractions: value.phaseVolumeFractions as readonly number[],
      phaseRelativePermittivities:
        value.phaseRelativePermittivities as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

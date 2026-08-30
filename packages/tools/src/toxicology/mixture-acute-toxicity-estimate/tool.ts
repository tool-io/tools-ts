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
} from "../shared.js";
export type Input = Readonly<{
  readonly componentMassFractions: readonly number[];
  readonly componentAteValues: readonly number[];
  readonly uncharacterizedMassFraction: number;
}>;
export type Output = Readonly<{
  readonly knownToxicFraction: number;
  readonly mixtureAte: number;
  readonly uncharacterizedFraction: number;
}>;
const inputFields = [
  {
    id: "componentMassFractions",
    label: "Component mass fractions",
    kind: "numberList",
  },
  {
    id: "componentAteValues",
    label: "Component ate values",
    kind: "numberList",
  },
  {
    id: "uncharacterizedMassFraction",
    label: "Uncharacterized mass fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.componentMassFractions,
    input.componentAteValues,
    "componentMassFractions",
  );
  input.componentMassFractions.forEach((v) =>
    fraction(v, "componentMassFractions"),
  );
  input.componentAteValues.forEach((v) => positive(v, "componentAteValues"));
  fraction(input.uncharacterizedMassFraction, "uncharacterizedMassFraction");
  const knownToxicFraction = input.componentMassFractions.reduce(
    (a, b) => a + b,
    0,
  );
  if (knownToxicFraction + input.uncharacterizedMassFraction > 1 + 1e-12)
    simpleError(
      "componentMassFractions",
      "Characterized toxic plus uncharacterized mass cannot exceed one; remainder is caller-characterized nontoxic material.",
    );
  const reciprocal = positive(
    input.componentMassFractions.reduce(
      (s, v, i) => s + v / input.componentAteValues[i],
      0,
    ),
    "componentMassFractions",
  );
  return {
    knownToxicFraction,
    mixtureAte: (1 - input.uncharacterizedMassFraction) / reciprocal,
    uncharacterizedFraction: input.uncharacterizedMassFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  componentMassFractions: [0.2, 0.3],
  componentAteValues: [100, 200],
  uncharacterizedMassFraction: 0.1,
} satisfies Input;
export const exampleOutput = {
  knownToxicFraction: 0.5,
  mixtureAte: 257.14285714285717,
  uncharacterizedFraction: 0.1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/mixture-acute-toxicity-estimate",
  title: "Acute Toxicity Estimate",
  description:
    "Calculate an explicitly unknown-fraction-adjusted ATE additivity estimate using supplied compatible route/endpoints; excluded material is not assumed safe and no GHS category is assigned.",
  inputs: inputFields,
  outputs: [
    { id: "knownToxicFraction", label: "Known toxic fraction", kind: "number" },
    { id: "mixtureAte", label: "Mixture ate", kind: "number" },
    {
      id: "uncharacterizedFraction",
      label: "Uncharacterized fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      componentMassFractions: value.componentMassFractions as readonly number[],
      componentAteValues: value.componentAteValues as readonly number[],
      uncharacterizedMassFraction: value.uncharacterizedMassFraction as number,
    }),
});
export const run = tool.execute;
export default tool;

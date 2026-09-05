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
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly isotopeRatios: readonly number[];
  readonly elementConcentrations: readonly number[];
  readonly firstMassFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly mixedConcentrations: readonly number[];
  readonly mixedRatios: readonly number[];
}>;
const inputFields = [
  { id: "isotopeRatios", label: "Isotope ratios", kind: "numberList" },
  {
    id: "elementConcentrations",
    label: "Element concentrations",
    kind: "numberList",
  },
  {
    id: "firstMassFractions",
    label: "First mass fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.elementConcentrations.forEach((v) =>
    positive(v, "elementConcentrations"),
  );
  input.firstMassFractions.forEach((v) => fraction(v, "firstMassFractions"));
  if (
    input.isotopeRatios.length !== 2 ||
    input.elementConcentrations.length !== 2
  )
    simpleError("endmembers", "Two matched isotope-denominator endmembers.");
  const [a, b] = input.elementConcentrations,
    [ra, rb] = input.isotopeRatios,
    c = input.firstMassFractions.map((f) => f * a + (1 - f) * b);
  return {
    mixedConcentrations: c,
    mixedRatios: input.firstMassFractions.map(
      (f, i) => (f * a * ra + (1 - f) * b * rb) / c[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  isotopeRatios: [1, 3],
  elementConcentrations: [1, 3],
  firstMassFractions: [0, 0.5, 1],
} satisfies Input;
export const exampleOutput = {
  mixedConcentrations: [3, 2, 1],
  mixedRatios: [3, 2.5, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/mixing-hyperbola",
  title: "Geology Mixing Hyperbola Calculator",
  description:
    "Concentration-weighted two-endmember isotope mixing hyperbola on declared common denominator, not arithmetic isotope mean. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "mixedConcentrations",
      label: "Mixed concentrations",
      kind: "numberList",
    },
    { id: "mixedRatios", label: "Mixed ratios", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      isotopeRatios: value.isotopeRatios as readonly number[],
      elementConcentrations: value.elementConcentrations as readonly number[],
      firstMassFractions: value.firstMassFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
  aligned,
  sum,
  simpleError,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly bodyMassKg: number;
  readonly rockFraction: number;
  readonly isotopeMassFractionsInRock: readonly number[];
  readonly isotopeSpecificPowerWPerKg: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "bodyMassKg", label: "Body mass kg", kind: "number" },
  { id: "rockFraction", label: "Rock fraction", kind: "number" },
  {
    id: "isotopeMassFractionsInRock",
    label: "Isotope mass fractions in rock",
    kind: "numberList",
  },
  {
    id: "isotopeSpecificPowerWPerKg",
    label: "Isotope specific power w per kg",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  nonnegative(i.bodyMassKg, "mass");
  fraction(i.rockFraction, "rock");
  aligned(
    i.isotopeMassFractionsInRock,
    i.isotopeSpecificPowerWPerKg,
    "isotopes",
  );
  i.isotopeMassFractionsInRock.forEach((v) => fraction(v, "abundance"));
  i.isotopeSpecificPowerWPerKg.forEach((v) => nonnegative(v, "power"));
  if (sum(i.isotopeMassFractionsInRock) > 1)
    simpleError("abundance", "Mass fractions sum<=1.");
  return {
    radiogenicPowerWatts:
      i.bodyMassKg *
      i.rockFraction *
      sum(
        i.isotopeMassFractionsInRock.map(
          (f, j) => f * i.isotopeSpecificPowerWPerKg[j],
        ),
      ),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    bodyMassKg: 100,
    rockFraction: 0.5,
    isotopeMassFractionsInRock: [0.1, 0.2],
    isotopeSpecificPowerWPerKg: [1, 2],
  },
  output: { result: { radiogenicPowerWatts: 25 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/radiogenic-heat-rock-fraction-calculator",
  title: "Radiogenic Heat Production Rock Fraction Calculator",
  description:
    "Rock-fraction radiogenic isotope power budget from actual caller epoch-specific abundances and specific powers; no isotope inventory inference.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

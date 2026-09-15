import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly surveyedStars: number;
  readonly quietStarFraction: number;
  readonly planetFraction: number;
  readonly habitablePlanetFraction: number;
  readonly lifeFraction: number;
  readonly detectableSignatureFraction: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "surveyedStars", label: "Surveyed stars", kind: "number" },
  { id: "quietStarFraction", label: "Quiet star fraction", kind: "number" },
  { id: "planetFraction", label: "Planet fraction", kind: "number" },
  {
    id: "habitablePlanetFraction",
    label: "Habitable planet fraction",
    kind: "number",
  },
  { id: "lifeFraction", label: "Life fraction", kind: "number" },
  {
    id: "detectableSignatureFraction",
    label: "Detectable signature fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  nonnegative(i.surveyedStars, "stars");
  [
    i.quietStarFraction,
    i.planetFraction,
    i.habitablePlanetFraction,
    i.lifeFraction,
    i.detectableSignatureFraction,
  ].forEach((v) => fraction(v, "fraction"));
  return {
    conditionalDetectableWorlds:
      i.surveyedStars *
      i.quietStarFraction *
      i.planetFraction *
      i.habitablePlanetFraction *
      i.lifeFraction *
      i.detectableSignatureFraction,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    surveyedStars: 10000,
    quietStarFraction: 0.5,
    planetFraction: 0.5,
    habitablePlanetFraction: 0.1,
    lifeFraction: 0.2,
    detectableSignatureFraction: 0.1,
  },
  output: { result: { conditionalDetectableWorlds: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/seager-equation-calculator",
  title: "Seager Equation Detectable Biosignature Worlds Calculator",
  description:
    "Conditional Seager-style biosignature-world product using independently established factors; fractions not measured here, no evidence that life exists.",
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

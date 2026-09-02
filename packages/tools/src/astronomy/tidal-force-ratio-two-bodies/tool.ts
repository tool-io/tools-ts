import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly firstPerturberMassKg: number;
  readonly firstDistanceMeters: number;
  readonly secondPerturberMassKg: number;
  readonly secondDistanceMeters: number;
}>;
export type Output = Readonly<{
  readonly firstOverSecondTidalGradient: number;
}>;
const inputFields = [
  {
    id: "firstPerturberMassKg",
    label: "First perturber mass kg",
    kind: "number",
  },
  { id: "firstDistanceMeters", label: "First distance meters", kind: "number" },
  {
    id: "secondPerturberMassKg",
    label: "Second perturber mass kg",
    kind: "number",
  },
  {
    id: "secondDistanceMeters",
    label: "Second distance meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.firstDistanceMeters, "firstDistanceMeters");
  positive(input.secondPerturberMassKg, "secondPerturberMassKg");
  positive(input.secondDistanceMeters, "secondDistanceMeters");
  nonnegative(input.firstPerturberMassKg, "firstPerturberMassKg");
  return {
    firstOverSecondTidalGradient:
      (input.firstPerturberMassKg / input.secondPerturberMassKg) *
      (input.secondDistanceMeters / input.firstDistanceMeters) ** 3,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  firstPerturberMassKg: 8,
  firstDistanceMeters: 2,
  secondPerturberMassKg: 1,
  secondDistanceMeters: 1,
} satisfies Input;
export const exampleOutput = {
  firstOverSecondTidalGradient: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/tidal-force-ratio-two-bodies",
  title: "Tidal Force Ratio Two Bodies Calculator",
  description:
    "Same local target differential tidal-gradient ratio M/r³, not ordinary inverse-square force ratio. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "firstOverSecondTidalGradient",
      label: "First over second tidal gradient",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      firstPerturberMassKg: value.firstPerturberMassKg as number,
      firstDistanceMeters: value.firstDistanceMeters as number,
      secondPerturberMassKg: value.secondPerturberMassKg as number,
      secondDistanceMeters: value.secondDistanceMeters as number,
    }),
});
export const run = tool.execute;
export default tool;

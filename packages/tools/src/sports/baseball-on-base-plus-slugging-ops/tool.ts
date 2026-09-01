import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedHits: number;
  readonly observedWalks: number;
  readonly observedHitByPitch: number;
  readonly observedAtBats: number;
  readonly observedSacrificeFlies: number;
  readonly observedTotalBases: number;
}>;
export type Output = Readonly<{
  readonly observedOnBaseRate: number;
  readonly observedSluggingRate: number;
  readonly observedOps: number;
}>;
const inputFields = [
  { id: "observedHits", label: "Observed hits", kind: "number" },
  { id: "observedWalks", label: "Observed walks", kind: "number" },
  { id: "observedHitByPitch", label: "Observed hit by pitch", kind: "number" },
  { id: "observedAtBats", label: "Observed at bats", kind: "number" },
  {
    id: "observedSacrificeFlies",
    label: "Observed sacrifice flies",
    kind: "number",
  },
  { id: "observedTotalBases", label: "Observed total bases", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  [
    input.observedHits,
    input.observedWalks,
    input.observedHitByPitch,
    input.observedSacrificeFlies,
    input.observedTotalBases,
  ].forEach((v) => bounded(v, "count", 0, 1000000));
  bounded(input.observedAtBats, "atBats", 1, 1000000);
  if (
    input.observedHits > input.observedAtBats ||
    input.observedTotalBases < input.observedHits ||
    input.observedTotalBases > 4 * input.observedHits
  )
    simpleError("bases", "Hits/total-bases evidence inconsistent.");
  const onbase =
      (input.observedHits + input.observedWalks + input.observedHitByPitch) /
      (input.observedAtBats +
        input.observedWalks +
        input.observedHitByPitch +
        input.observedSacrificeFlies),
    slg = input.observedTotalBases / input.observedAtBats;
  return {
    observedOnBaseRate: onbase,
    observedSluggingRate: slg,
    observedOps: onbase + slg,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedHits: 5,
  observedWalks: 2,
  observedHitByPitch: 1,
  observedAtBats: 10,
  observedSacrificeFlies: 1,
  observedTotalBases: 8,
} satisfies Input;
export const exampleOutput = {
  observedOnBaseRate: 0.5714285714285714,
  observedSluggingRate: 0.8,
  observedOps: 1.3714285714285714,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/baseball-on-base-plus-slugging-ops",
  title: "Baseball OPS Calculator",
  description:
    "Compute baseball actual OBP+SLG with walk/HBP/sac-fly denominator and independent verified total bases; no scalar add alias or assumed plate appearances.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedOnBaseRate",
      label: "Observed on base rate",
      kind: "number",
    },
    {
      id: "observedSluggingRate",
      label: "Observed slugging rate",
      kind: "number",
    },
    { id: "observedOps", label: "Observed ops", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedHits: value.observedHits as number,
      observedWalks: value.observedWalks as number,
      observedHitByPitch: value.observedHitByPitch as number,
      observedAtBats: value.observedAtBats as number,
      observedSacrificeFlies: value.observedSacrificeFlies as number,
      observedTotalBases: value.observedTotalBases as number,
    }),
});
export const run = tool.execute;
export default tool;

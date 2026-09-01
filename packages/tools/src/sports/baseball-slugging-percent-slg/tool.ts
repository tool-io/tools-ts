import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, bounded, sum } from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedSingles: number;
  readonly observedDoubles: number;
  readonly observedTriples: number;
  readonly observedHomeRuns: number;
  readonly observedAtBats: number;
}>;
export type Output = Readonly<{
  readonly observedTotalBases: number;
  readonly sluggingRate: number;
}>;
const inputFields = [
  { id: "observedSingles", label: "Observed singles", kind: "number" },
  { id: "observedDoubles", label: "Observed doubles", kind: "number" },
  { id: "observedTriples", label: "Observed triples", kind: "number" },
  { id: "observedHomeRuns", label: "Observed home runs", kind: "number" },
  { id: "observedAtBats", label: "Observed at bats", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.observedAtBats, "atBats", 1, 1000000);
  [
    input.observedSingles,
    input.observedDoubles,
    input.observedTriples,
    input.observedHomeRuns,
  ].forEach((v) => bounded(v, "hits", 0, 1000000));
  if (
    sum([
      input.observedSingles,
      input.observedDoubles,
      input.observedTriples,
      input.observedHomeRuns,
    ]) > input.observedAtBats
  )
    simpleError("hits", "Distinct hit outcomes cannot exceed at-bats.");
  const bases =
    input.observedSingles +
    2 * input.observedDoubles +
    3 * input.observedTriples +
    4 * input.observedHomeRuns;
  return {
    observedTotalBases: bases,
    sluggingRate: bases / input.observedAtBats,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSingles: 2,
  observedDoubles: 1,
  observedTriples: 1,
  observedHomeRuns: 1,
  observedAtBats: 10,
} satisfies Input;
export const exampleOutput = {
  observedTotalBases: 11,
  sluggingRate: 1.1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/baseball-slugging-percent-slg",
  title: "Baseball SLG Calculator",
  description:
    "Reconcile actual mutually exclusive baseball hits to total bases/AB slugging (can exceed one); not OBP or percent probability.",
  inputs: inputFields,
  outputs: [
    { id: "observedTotalBases", label: "Observed total bases", kind: "number" },
    { id: "sluggingRate", label: "Slugging rate", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedSingles: value.observedSingles as number,
      observedDoubles: value.observedDoubles as number,
      observedTriples: value.observedTriples as number,
      observedHomeRuns: value.observedHomeRuns as number,
      observedAtBats: value.observedAtBats as number,
    }),
});
export const run = tool.execute;
export default tool;

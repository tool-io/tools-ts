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
  nonnegative,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly naKAlOxideMasses: readonly number[];
  readonly matchedMolarMasses: readonly number[];
}>;
export type Output = Readonly<{ readonly peralkalinity: number }>;
const inputFields = [
  { id: "naKAlOxideMasses", label: "Na k al oxide masses", kind: "numberList" },
  {
    id: "matchedMolarMasses",
    label: "Matched molar masses",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.matchedMolarMasses.forEach((v) => positive(v, "matchedMolarMasses"));
  input.naKAlOxideMasses.forEach((v) => nonnegative(v, "naKAlOxideMasses"));
  if (
    input.naKAlOxideMasses.length !== 3 ||
    input.matchedMolarMasses.length !== 3
  )
    simpleError("oxides", "OrderedNa2O, K2O, Al2O3.");
  const n = input.naKAlOxideMasses.map(
    (v, i) => v / input.matchedMolarMasses[i],
  );
  return { peralkalinity: (n[0] + n[1]) / positive(n[2], "Almoles") };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  naKAlOxideMasses: [2, 3, 4],
  matchedMolarMasses: [2, 3, 2],
} satisfies Input;
export const exampleOutput = { peralkalinity: 1 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/peralkalinity-index",
  title: "Geology Peralkalinity Index Calculator",
  description:
    "Molar(Na2O+K2O)/Al2O3, independently matched molar masses not weight sum. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [{ id: "peralkalinity", label: "Peralkalinity", kind: "number" }],
  calculate: (value) =>
    calculate({
      naKAlOxideMasses: value.naKAlOxideMasses as readonly number[],
      matchedMolarMasses: value.matchedMolarMasses as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

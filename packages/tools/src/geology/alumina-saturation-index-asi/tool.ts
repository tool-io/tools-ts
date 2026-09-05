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
  readonly alCaNaKOxideMasses: readonly number[];
  readonly matchedMolarMasses: readonly number[];
  readonly independentApatiteCaMoles: number;
}>;
export type Output = Readonly<{ readonly aluminaSaturation: number }>;
const inputFields = [
  {
    id: "alCaNaKOxideMasses",
    label: "Al ca na k oxide masses",
    kind: "numberList",
  },
  {
    id: "matchedMolarMasses",
    label: "Matched molar masses",
    kind: "numberList",
  },
  {
    id: "independentApatiteCaMoles",
    label: "Independent apatite ca moles",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.matchedMolarMasses.forEach((v) => positive(v, "matchedMolarMasses"));
  input.alCaNaKOxideMasses.forEach((v) => nonnegative(v, "alCaNaKOxideMasses"));
  nonnegative(input.independentApatiteCaMoles, "independentApatiteCaMoles");
  if (
    input.alCaNaKOxideMasses.length !== 4 ||
    input.matchedMolarMasses.length !== 4
  )
    simpleError("oxides", "OrderedAl2O3, CaO, Na2O, K2O.");
  const n = input.alCaNaKOxideMasses.map(
      (v, i) => v / input.matchedMolarMasses[i],
    ),
    ca = nonnegative(n[1] - input.independentApatiteCaMoles, "correctedCa");
  return { aluminaSaturation: n[0] / positive(ca + n[2] + n[3], "CNK") };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  alCaNaKOxideMasses: [4, 1, 2, 3],
  matchedMolarMasses: [2, 1, 2, 3],
  independentApatiteCaMoles: 0,
} satisfies Input;
export const exampleOutput = {
  aluminaSaturation: 0.6666666666666666,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/alumina-saturation-index-asi",
  title: "Geology Alumina Saturation Index Asi Calculator",
  description:
    "MolarA/(correctedC+N+K), independently determined apatite correction; calcium enters denominator unlike peralkalinity. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    { id: "aluminaSaturation", label: "Alumina saturation", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      alCaNaKOxideMasses: value.alCaNaKOxideMasses as readonly number[],
      matchedMolarMasses: value.matchedMolarMasses as readonly number[],
      independentApatiteCaMoles: value.independentApatiteCaMoles as number,
    }),
});
export const run = tool.execute;
export default tool;

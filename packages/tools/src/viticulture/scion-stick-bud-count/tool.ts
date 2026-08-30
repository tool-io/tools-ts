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
  fraction,
  aligned,
  shape,
  integerSpan,
} from "../shared.js";
export type Input = Readonly<{
  readonly scionStickUsableLengthsCm: readonly number[];
  readonly internodeSpacingsCm: readonly number[];
  readonly cutEndBudExclusionDistancesCm: readonly (readonly number[])[];
  readonly callerViableBudFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly geometricBudPositionsByStick: readonly number[];
  readonly expectedViableScionBudCount: number;
}>;
const inputFields = [
  {
    id: "scionStickUsableLengthsCm",
    label: "Scion stick usable lengths cm",
    kind: "numberList",
  },
  {
    id: "internodeSpacingsCm",
    label: "Internode spacings cm",
    kind: "numberList",
  },
  {
    id: "cutEndBudExclusionDistancesCm",
    label: "Cut end bud exclusion distances cm",
    kind: "matrix",
  },
  {
    id: "callerViableBudFractions",
    label: "Caller viable bud fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.internodeSpacingsCm.forEach((v) => positive(v, "internodeSpacingsCm"));
  input.scionStickUsableLengthsCm.forEach((v) =>
    nonnegative(v, "scionStickUsableLengthsCm"),
  );
  input.callerViableBudFractions.forEach((v) =>
    fraction(v, "callerViableBudFractions"),
  );
  aligned(
    input.scionStickUsableLengthsCm,
    input.internodeSpacingsCm,
    "scionStickUsableLengthsCm",
  );
  aligned(
    input.scionStickUsableLengthsCm,
    input.cutEndBudExclusionDistancesCm,
    "scionStickUsableLengthsCm",
  );
  aligned(
    input.scionStickUsableLengthsCm,
    input.callerViableBudFractions,
    "scionStickUsableLengthsCm",
  );
  if (shape(input.cutEndBudExclusionDistancesCm, "exclusions") !== 2)
    simpleError(
      "exclusions",
      "Two bud exclusions per measured stick required.",
    );
  const geometricBudPositionsByStick = input.scionStickUsableLengthsCm.map(
    (l, i) =>
      integerSpan(
        l,
        input.internodeSpacingsCm[i],
        input.cutEndBudExclusionDistancesCm[i][0],
        input.cutEndBudExclusionDistancesCm[i][1],
      ),
  );
  return {
    geometricBudPositionsByStick,
    expectedViableScionBudCount: geometricBudPositionsByStick.reduce(
      (s, v, i) => s + v * input.callerViableBudFractions[i],
      0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  scionStickUsableLengthsCm: [10, 20],
  internodeSpacingsCm: [2, 3],
  cutEndBudExclusionDistancesCm: [
    [1, 1],
    [2, 2],
  ],
  callerViableBudFractions: [1, 0.5],
} satisfies Input;
export const exampleOutput = {
  geometricBudPositionsByStick: [5, 6],
  expectedViableScionBudCount: 8,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/scion-stick-bud-count",
  title: "Scion Stick Bud Count Tool",
  description:
    "Screen usable scion bud positions under caller internode/endpoint geometry and independently measured viability; expected viable count is fractional, not observed buds or graft-grade assurance.",
  inputs: inputFields,
  outputs: [
    {
      id: "geometricBudPositionsByStick",
      label: "Geometric bud positions by stick",
      kind: "numberList",
    },
    {
      id: "expectedViableScionBudCount",
      label: "Expected viable scion bud count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      scionStickUsableLengthsCm:
        value.scionStickUsableLengthsCm as readonly number[],
      internodeSpacingsCm: value.internodeSpacingsCm as readonly number[],
      cutEndBudExclusionDistancesCm:
        value.cutEndBudExclusionDistancesCm as readonly (readonly number[])[],
      callerViableBudFractions:
        value.callerViableBudFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

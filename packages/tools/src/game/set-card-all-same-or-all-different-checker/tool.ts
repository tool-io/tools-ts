import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, shape, bounded, cards } from "../shared.js";
export type Input = Readonly<{
  readonly threeCardFeatures: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly validSet: boolean;
  readonly allSameOrAllDifferentFeatureFlags: readonly number[];
}>;
const inputFields = [
  { id: "threeCardFeatures", label: "Three card features", kind: "matrix" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    shape(input.threeCardFeatures, "cards") !== 4 ||
    input.threeCardFeatures.length !== 3 ||
    new Set(input.threeCardFeatures.map((r) => r.join(","))).size !== 3
  )
    simpleError(
      "cards",
      "Three distinct cards with four ternary features required.",
    );
  input.threeCardFeatures.forEach((r) =>
    r.forEach((v) => bounded(v, "feature", 0, 2)),
  );
  const f = Array.from({ length: 4 }, (_, i) => {
    const n = new Set(input.threeCardFeatures.map((r) => r[i])).size;
    return n === 1 || n === 3 ? 1 : 0;
  });
  return {
    validSet: f.every((v) => v === 1),
    allSameOrAllDifferentFeatureFlags: f,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  threeCardFeatures: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [2, 2, 2, 2],
  ],
} satisfies Input;
export const exampleOutput = {
  validSet: true,
  allSameOrAllDifferentFeatureFlags: [1, 1, 1, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/set-card-all-same-or-all-different-checker",
  title: "SET Card All-Same-or-All-Different Check",
  description:
    "Check all four actual ternary SET features for all-same/all-different across three distinct cards; physical duplicate cards rejected, no visual feature extraction.",
  inputs: inputFields,
  outputs: [
    { id: "validSet", label: "Valid set", kind: "boolean" },
    {
      id: "allSameOrAllDifferentFeatureFlags",
      label: "All same or all different feature flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      threeCardFeatures:
        value.threeCardFeatures as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;

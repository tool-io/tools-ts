import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, featureClasses } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly observedFeatureFlags: readonly number[];
  readonly featureKnownFlags: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedFeatureFlags",
    label: "Observed feature flags",
    kind: "numberList",
  },
  { id: "featureKnownFlags", label: "Feature known flags", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return featureClasses(
    input.observedFeatureFlags,
    input.featureKnownFlags,
    ["caller-witnessed-pattern-candidate"],
    [[1, 1, 1]],
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { observedFeatureFlags: [1, 1, 1], featureKnownFlags: [1, 1, 1] },
  output: {
    result: {
      compatibleClasses: ["caller-witnessed-pattern-candidate"],
      witnessedClasses: ["caller-witnessed-pattern-candidate"],
      unknownFeatureIndices: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/nordic-family-checker",
  title: "Nordic Cross Family Membership Checker",
  description:
    "Audit Nordic Cross Family Membership Checkervisual-feature annotations, not an image detector, official family membership or geographic/political identification. Feature columns, independently annotated in order: full spanning orthogonal cross, vertical stem toward hoist, hoist/top coordinates verified. Unknown evidence and compatible classes retained; not automated semantic, historical, identity, legal or safety determination.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

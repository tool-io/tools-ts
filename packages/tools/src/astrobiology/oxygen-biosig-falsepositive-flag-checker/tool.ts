import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, featureClasses } from "../batch46-shared.js";
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
    [
      "oxygen-with-abiotic-alternative-review",
      "oxygen-with-excluded-stated-alternative",
    ],
    [
      [1, 1, 0],
      [1, 0, 1],
    ],
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { observedFeatureFlags: [1, 1, 0], featureKnownFlags: [1, 1, 1] },
  output: {
    result: {
      compatibleClasses: ["oxygen-with-abiotic-alternative-review"],
      witnessedClasses: ["oxygen-with-abiotic-alternative-review"],
      unknownFeatureIndices: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/oxygen-biosig-falsepositive-flag-checker",
  title: "Oxygen Biosignature False Positive Abiotic Override Flag Checker",
  description:
    "Audit independently established oxygen/abiotic-pathway evidence, not every possible false positive or proof oxygen is biological. Independently established feature columns: oxygen observation independently established, water-loss/abiotic pathway independently plausible, abiotic pathway independently excluded. Unknown evidence and overlapping candidates retained; not semantic parsing, identity, causation, diagnosis, lawfulness, authenticity or safety determination.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

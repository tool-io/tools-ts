import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, featureClasses } from "../batch45-shared.js";
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
    ["cast-copy-review-candidate"],
    [[1, 1]],
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { observedFeatureFlags: [1, 1], featureKnownFlags: [1, 1] },
  output: {
    result: {
      compatibleClasses: ["cast-copy-review-candidate"],
      witnessedClasses: ["cast-copy-review-candidate"],
      unknownFeatureIndices: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/seam-edge-cast-copy-checker",
  title: "Seam Edge Cast Copy Checker",
  description:
    "Organize actual noninvasive seam/porosity evidence for specialist review, not definitive cast-copy identification or destructive testing instructions. Independently established columns: continuous edge seam independently observed, casting porosity independently observed. Unknown observations and overlapping candidates retained; not automatic semantic parsing, proof of identity, fraud, authenticity, compliance or coverage.",
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

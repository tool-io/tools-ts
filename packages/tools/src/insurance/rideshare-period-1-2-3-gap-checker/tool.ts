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
    ["period-1", "period-2", "period-3"],
    [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ],
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { observedFeatureFlags: [1, 0, 0], featureKnownFlags: [1, 1, 1] },
  output: {
    result: {
      compatibleClasses: ["period-1"],
      witnessedClasses: ["period-1"],
      unknownFeatureIndices: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/rideshare-period-1-2-3-gap-checker",
  title: "Rideshare Period 1 2 3 Gap Checker",
  description:
    "Map independently observed rideshare operational period before separately reviewing actual personal/platform policies; operational label alone is not a gap or coverage verdict. Independently established columns: app online waiting period independently established, accepted ride en-route period independently established, passenger transport period independently established. Unknown observations and overlapping candidates retained; not automatic semantic parsing, proof of identity, fraud, authenticity, compliance or coverage.",
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
